package com.antigravity.urlshortener;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * The entry point for the Ushort URL Shortener application.
 * Bootstraps the Spring context, auto-configuration, and embedded Tomcat
 * server.
 */
@SpringBootApplication
public class UrlShortenerApplication {

    /**
     * Standard main method for launching the Spring Boot application.
     * 
     * @param args Command-line arguments
     */
    public static void main(String[] args) {
        SpringApplication.run(UrlShortenerApplication.class, args);
    }

}
