package com.antigravity.urlshortener.service;

import com.antigravity.urlshortener.dto.ShortenRequest;
import com.antigravity.urlshortener.dto.ShortenResponse;
import com.antigravity.urlshortener.entity.UrlMapping;
import com.antigravity.urlshortener.repository.UrlMappingRepository;
import com.antigravity.urlshortener.util.Base62Encoder;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.antigravity.urlshortener.exception.InvalidUrlException;
import com.antigravity.urlshortener.exception.UrlExpiredException;
import com.antigravity.urlshortener.exception.UrlNotFoundException;
import com.antigravity.urlshortener.util.HashUtils;
import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Core service for URL shortening operations.
 * Implements a 5-step shortening pipeline:
 * 1. Hardening (validation)
 * 2. Self-referencing protection
 * 3. Protocol sanitization
 * 4. Deduplication
 * 5. Unique code generation
 */
@Service
@RequiredArgsConstructor
public class UrlShortenerService {

    private final UrlMappingRepository repository;
    private final Base62Encoder base62Encoder;

    @Value("${app.features.deduplicate:true}")
    private boolean deduplicateEnabled;

    /**
     * Transforms a long URL into a trackable short code.
     * 
     * @param request        The request DTO containing the original URL
     * @param currentBaseUrl The base URL of this service (to prevent
     *                       self-shortening)
     * @return ShortenResponse containing the generated code and metadata
     * @throws InvalidUrlException if validation fails or domain is prohibited
     */
    @Transactional
    public ShortenResponse shortenUrl(ShortenRequest request, String currentBaseUrl) {
        String originalUrl = request.getOriginalUrl();

        // 1. Basic Hardening: Check for nulls, blanks and excessive length
        if (originalUrl == null || originalUrl.isBlank()) {
            throw new InvalidUrlException("URL cannot be empty");
        }

        if (originalUrl.length() > 2000) {
            throw new InvalidUrlException("URL is too long (max 2000 characters)");
        }

        // 2. Self-Referencing Protection: Prevent shortening Ushort links (recursion)
        if (currentBaseUrl != null && originalUrl.startsWith(currentBaseUrl)) {
            throw new InvalidUrlException("Cannot shorten URLs belonging to this domain");
        }

        // 3. Protocol Sanitization: Ensure standard format and auto-prepend protocol if
        // missing
        originalUrl = originalUrl.trim();
        if (!originalUrl.toLowerCase().startsWith("http://") &&
                !originalUrl.toLowerCase().startsWith("https://")) {
            if (!originalUrl.contains("://")) {
                originalUrl = "https://" + originalUrl;
            } else {
                throw new InvalidUrlException("Only http and https protocols are allowed");
            }
        }

        String lowerUrl = originalUrl.toLowerCase();
        if (!lowerUrl.startsWith("http://") && !lowerUrl.startsWith("https://")) {
            throw new InvalidUrlException("Only http and https protocols are allowed");
        }

        // 4. Deduplication Logic: Reuse existing codes for identical URLs (if enabled)
        String urlHash = HashUtils.sha256(originalUrl);
        if (deduplicateEnabled) {
            Optional<UrlMapping> existing = repository.findByUrlHash(urlHash);
            if (existing.isPresent()) {
                UrlMapping mapping = existing.get();
                return ShortenResponse.builder()
                        .originalUrl(mapping.getOriginalUrl())
                        .shortCode(mapping.getShortCode())
                        .shortUrl(null) // Controller will build this
                        .expiresAt(mapping.getExpiresAt())
                        .build();
            }
        }

        // 5. Initial Save to get ID (used as seed for Base62 encoding)
        UrlMapping mapping = new UrlMapping();
        mapping.setOriginalUrl(originalUrl);
        mapping.setUrlHash(urlHash);
        mapping.setCreatedAt(LocalDateTime.now());
        mapping.setExpiresAt(LocalDateTime.now().plusDays(30));
        mapping = repository.saveAndFlush(mapping);

        // 4. Generate Short Code: Combine Base62(ID) with a random 2-char suffix for
        // collision resistance
        String core = base62Encoder.encode(mapping.getId());
        String shortCode = core + base62Encoder.generateRandomSuffix(2);
        mapping.setShortCode(shortCode);

        try {
            repository.saveAndFlush(mapping);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            // 5. Collision Handling: Retry once with a new random suffix if a code clash
            // occurs
            shortCode = core + base62Encoder.generateRandomSuffix(2);
            mapping.setShortCode(shortCode);
            try {
                repository.saveAndFlush(mapping);
            } catch (Exception ex) {
                throw new RuntimeException("Failed to generate unique short code. Please try again.");
            }
        }

        return ShortenResponse.builder()
                .originalUrl(mapping.getOriginalUrl())
                .shortCode(mapping.getShortCode())
                .shortUrl(null) // To be populated by controller
                .expiresAt(mapping.getExpiresAt())
                .build();
    }

    /**
     * Resolves a short code back to its original destination URL.
     * Features atomic click tracking and expiration validation.
     * 
     * @param shortCode The identifier for the redirection
     * @return The original long URL
     * @throws UrlNotFoundException if code doesn't exist or is deactivated
     * @throws UrlExpiredException  if the link has passed its expiry date
     */
    @Transactional
    public String getOriginalUrl(String shortCode) {

        UrlMapping mapping = repository.findByShortCode(shortCode)
                .orElseThrow(() -> new UrlNotFoundException("URL mapping not found for code: " + shortCode));

        if (!mapping.isActive()) {
            throw new UrlNotFoundException("This link has been deactivated");
        }

        if (mapping.getExpiresAt() != null &&
                mapping.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new UrlExpiredException("URL has expired");
        }

        // 🔥 Atomic increment click count in DB
        repository.incrementClickCount(shortCode);

        return mapping.getOriginalUrl();
    }

}
