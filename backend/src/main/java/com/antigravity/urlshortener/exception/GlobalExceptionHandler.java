package com.antigravity.urlshortener.exception;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        String correlationId = MDC.get("correlationId");
        if (correlationId != null) {
            error.put("traceId", correlationId);
        }
        return error;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        log.error("Validation failed: {}", ex.getMessage());

        // Return the first specific validation error message instead of generic
        // "Validation failed"
        String errorMessage = ex.getBindingResult().getAllErrors().stream()
                .findFirst()
                .map(org.springframework.validation.ObjectError::getDefaultMessage)
                .orElse("Validation failed");

        Map<String, String> errors = createErrorResponse(errorMessage);
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidUrlException.class)
    public ResponseEntity<Map<String, String>> handleInvalidUrlException(InvalidUrlException ex) {
        log.warn("Invalid URL request: {}", ex.getMessage());
        return new ResponseEntity<>(createErrorResponse(ex.getMessage()), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UrlExpiredException.class)
    public ResponseEntity<Map<String, String>> handleUrlExpiredException(UrlExpiredException ex) {
        log.info("Expired URL access: {}", ex.getMessage());
        return new ResponseEntity<>(createErrorResponse(ex.getMessage()), HttpStatus.GONE);
    }

    @ExceptionHandler(UrlNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleUrlNotFoundException(UrlNotFoundException ex) {
        log.info("URL not found: {}", ex.getMessage());
        return new ResponseEntity<>(createErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGlobalException(Exception ex) {
        log.error("Unexpected error occurred", ex);
        return new ResponseEntity<>(createErrorResponse("An unexpected error occurred"),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
