package com.antigravity.urlshortener.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Entity representing a URL mapping in the database.
 * Maps original long URLs to unique short codes and tracks usage metrics.
 * 
 * Includes database-level indexes on shortCode and urlHash for O(1) lookups.
 */
@Entity
@Table(name = "url_mapping", indexes = {
        @Index(name = "idx_short_code", columnList = "shortCode", unique = true),
        @Index(name = "idx_url_hash", columnList = "urlHash", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
public class UrlMapping {

    /**
     * The unique identifier for the URL mapping.
     * This is an auto-generated primary key.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** The full destination URL */
    @Column(nullable = false, columnDefinition = "TEXT")
    private String originalUrl;

    /** SHA-256 hash of the original URL, used for rapid deduplication checks */
    @Column(length = 64, unique = true)
    private String urlHash;

    /** The unique encoded string representing this mapping in the URL path */
    @Column(length = 10, unique = true)
    private String shortCode;

    /** Total successful redirections performed */
    @Column(nullable = false)
    private long clickCount = 0;

    /** Automated timestamp of when the link was created */
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    /** Optional expiration date; redirection fails after this point */
    private LocalDateTime expiresAt;

    /** Manual override to disable a link without deleting the record */
    private boolean isActive = true;
}
