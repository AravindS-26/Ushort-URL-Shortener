package com.antigravity.urlshortener.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO representing the analytics data for a shortened URL.
 * Contains detailed information about usage, status, and expiration.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AnalyticsResponse {
    /** The original destination URL */
    private String originalUrl;
    /** The unique short code associated with the mapping */
    private String shortCode;
    /** The fully constructed short URL for redirection */
    private String shortUrl;
    /** Total number of times the short link has been accessed */
    private long clickCount;
    /** Timestamp when the mapping was first created */
    private LocalDateTime createdAt;
    /**
     * Timestamp when the link will become inaccessible (can be null for permanent
     * links)
     */
    private LocalDateTime expiresAt;

    /**
     * Whether the link is currently eligible for redirection.
     * Uses @JsonProperty to ensure correct Boolean mapping in JSON.
     */
    @JsonProperty("isActive")
    private boolean isActive;
}
