package com.antigravity.urlshortener.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

/**
 * Servlet filter that manages unique correlation IDs for every request.
 * Enables end-to-end tracing by:
 * 1. Extracting the ID from the incoming X-Correlation-ID header.
 * 2. Generating a new UUID if the header is missing.
 * 3. Adding the ID to the SLF4J MDC (Mapped Diagnostic Context) for log
 * enrichment.
 * 4. Injecting the ID back into the response headers.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CorrelationIdFilter implements Filter {

    private static final String CORRELATION_ID_HEADER = "X-Correlation-ID";
    private static final String MDC_CORRELATION_ID = "correlationId";

    /**
     * Main filtering logic for injecting correlation IDs into the execution
     * context.
     * Uses a try-finally block to ensure the MDC is cleared after the request
     * finishes.
     */
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        String correlationId = null;
        if (request instanceof HttpServletRequest httpServletRequest) {
            correlationId = httpServletRequest.getHeader(CORRELATION_ID_HEADER);
        }

        if (correlationId == null || correlationId.isBlank()) {
            correlationId = UUID.randomUUID().toString();
        }

        try {
            MDC.put(MDC_CORRELATION_ID, correlationId);
            if (response instanceof HttpServletResponse httpServletResponse) {
                httpServletResponse.setHeader(CORRELATION_ID_HEADER, correlationId);
            }
            chain.doFilter(request, response);
        } finally {
            MDC.remove(MDC_CORRELATION_ID);
        }
    }
}
