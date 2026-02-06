package com.antigravity.urlshortener.controller;

import com.antigravity.urlshortener.dto.AnalyticsResponse;
import com.antigravity.urlshortener.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.antigravity.urlshortener.util.ShortUrlBuilder;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final ShortUrlBuilder urlBuilder;

    @GetMapping("/{shortCode}")
    public ResponseEntity<AnalyticsResponse> getAnalytics(@PathVariable String shortCode) {
        AnalyticsResponse response = analyticsService.getAnalytics(shortCode);
        response.setShortUrl(urlBuilder.build(response.getShortCode()));
        return ResponseEntity.ok(response);
    }
}
