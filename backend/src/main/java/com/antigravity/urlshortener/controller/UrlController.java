package com.antigravity.urlshortener.controller;

import com.antigravity.urlshortener.dto.ShortenRequest;
import com.antigravity.urlshortener.dto.ShortenResponse;
import com.antigravity.urlshortener.service.UrlShortenerService;
import com.antigravity.urlshortener.util.ShortUrlBuilder;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.nio.charset.StandardCharsets;

// New imports required for AnalyticsController
import com.antigravity.urlshortener.dto.AnalyticsResponse;
import com.antigravity.urlshortener.service.AnalyticsService;

/**
 * Main controller for URL shortening and redirection.
 * Handles primary user interactions with short links.
 */
@RestController
@RequiredArgsConstructor
public class UrlController {

    private final UrlShortenerService service;
    private final ShortUrlBuilder urlBuilder;
    private final MeterRegistry meterRegistry;

    /**
     * Accepts a long URL and returns a unique shortened code and link.
     * Uses @Valid to ensure the request body conforms to protocol and non-blank
     * rules.
     * 
     * @param request The DTO containing the original URL to shorten
     * @return ResponseEntity containing the shortening metadata (code, link,
     *         expiry)
     */
    @PostMapping("/api/v1/shorten")
    public ResponseEntity<ShortenResponse> shortenUrl(@Valid @RequestBody ShortenRequest request) {
        String currentBaseUrl = urlBuilder.getBaseUrl();
        ShortenResponse response = service.shortenUrl(request, currentBaseUrl);
        response.setShortUrl(urlBuilder.build(response.getShortCode()));
        return ResponseEntity.ok(response);
    }

    /**
     * Performs the primary redirection logic.
     * Increases click counts, checks for expiration, and handles metrics reporting.
     * 
     * @param shortCode The unique path variable identifying a shortened link
     * @return 302 Redirect to original URL if found and active, otherwise 404 HTML
     */
    @GetMapping("/{shortCode}")
    public Object redirect(@PathVariable String shortCode) {
        Timer.Sample sample = Timer.start(meterRegistry);
        try {
            String originalUrl = service.getOriginalUrl(shortCode);
            meterRegistry.counter("ushort_redirects_total", "status", "success").increment();
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(originalUrl))
                    .build();
        } catch (Exception e) {
            meterRegistry.counter("ushort_redirects_total", "status", "error").increment();
            // Serve the 404.html page from classpath for browser-friendly errors
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .contentType(MediaType.TEXT_HTML)
                    .body(readHtmlResource("/static/404.html"));
        } finally {
            sample.stop(meterRegistry.timer("ushort_redirect_latency"));
        }
    }

    private String readHtmlResource(String path) {
        try {
            var is = getClass().getResourceAsStream(path);
            if (is == null)
                return "<h1>404 - Link Not Found</h1>";
            return new String(is.readAllBytes(), StandardCharsets.UTF_8);
        } catch (Exception e) {
            return "<h1>404 - Link Not Found</h1>";
        }
    }
}
