package com.antigravity.urlshortener.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

/**
 * DTO for the initial URL shortening request.
 * Contains the source URL and basic validation rules.
 */
@Data
public class ShortenRequest {
    /**
     * The original long URL submitted by the user.
     * Must not be blank and must follow a valid HTTP/HTTPS protocol format.
     */
    @NotBlank(message = "URL cannot be empty")
    @Pattern(regexp = "^(http|https)://.*$", message = "URL must start with http:// or https://")
    private String originalUrl;
}
