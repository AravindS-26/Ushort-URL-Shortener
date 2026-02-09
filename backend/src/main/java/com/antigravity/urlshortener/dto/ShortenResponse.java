package com.antigravity.urlshortener.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO representing the successful creation of a shortened URL.
 * Returned to the client after a successful /shorten request.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ShortenResponse {
    /** The original long URL that was shortened */
    private String originalUrl;
    /** The generated unique identifier for the redirection */
    private String shortCode;
    /** The fully qualified short URL ready for sharing */
    private String shortUrl;
    /** Optional expiration timestamp for the shortened link */
    private LocalDateTime expiresAt;
}
