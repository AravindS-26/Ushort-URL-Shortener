package com.antigravity.urlshortener.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Component
public class ShortUrlBuilder {

    @Value("${app.base-url:}")
    private String configuredBaseUrl;

    /**
     * Derives the base URL from configuration or current request context.
     * 
     * @return Base URL without trailing slash
     */
    public String getBaseUrl() {
        String baseUrl;
        if (configuredBaseUrl != null && !configuredBaseUrl.isBlank()) {
            baseUrl = configuredBaseUrl;
        } else {
            baseUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .build()
                    .toUriString();
        }

        if (baseUrl.endsWith("/")) {
            baseUrl = baseUrl.substring(0, baseUrl.length() - 1);
        }
        return baseUrl;
    }

    /**
     * Builds the full short URL for a given short code.
     * 
     * @param shortCode The generated short code
     * @return Full short URL
     */
    public String build(String shortCode) {
        return getBaseUrl() + "/" + shortCode;
    }
}
