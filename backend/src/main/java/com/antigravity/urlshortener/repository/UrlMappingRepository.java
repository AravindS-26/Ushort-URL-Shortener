package com.antigravity.urlshortener.repository;

import com.antigravity.urlshortener.entity.UrlMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UrlMappingRepository extends JpaRepository<UrlMapping, Long> {

    Optional<UrlMapping> findByShortCode(String shortCode);

    Optional<UrlMapping> findByUrlHash(String urlHash);

    @Modifying
    @Query("""
                UPDATE UrlMapping u
                SET u.clickCount = u.clickCount + 1
                WHERE u.shortCode = :shortCode
            """)
    int incrementClickCount(@Param("shortCode") String shortCode);
}
