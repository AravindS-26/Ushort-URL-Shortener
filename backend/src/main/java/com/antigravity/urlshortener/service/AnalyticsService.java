package com.antigravity.urlshortener.service;

import com.antigravity.urlshortener.dto.AnalyticsResponse;
import com.antigravity.urlshortener.entity.UrlMapping;
import com.antigravity.urlshortener.exception.UrlNotFoundException;
import com.antigravity.urlshortener.repository.UrlMappingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final UrlMappingRepository repository;

    @Transactional(readOnly = true)
    public AnalyticsResponse getAnalytics(String shortCode) {
        UrlMapping mapping = repository.findByShortCode(shortCode)
                .orElseThrow(() -> new UrlNotFoundException("URL mapping not found for code: " + shortCode));

        return AnalyticsResponse.builder()
                .originalUrl(mapping.getOriginalUrl())
                .shortCode(mapping.getShortCode())
                .clickCount(mapping.getClickCount())
                .createdAt(mapping.getCreatedAt())
                .expiresAt(mapping.getExpiresAt())
                .isActive(mapping.isActive())
                .build();
    }
}
