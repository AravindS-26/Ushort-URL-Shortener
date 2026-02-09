package com.antigravity.urlshortener.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * Cryptographic utility for generating secure link fingerprints.
 * Uses SHA-256 to ensure collision-resistant URL hashing for deduplication.
 */
public class HashUtils {

    /**
     * Generates a SHA-256 hex string for a given input.
     * 
     * @param input The raw string to hash
     * @return 64-character hex string representing the hash
     * @throws RuntimeException if SHA-256 algorithm is missing from the JVM
     */
    public static String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedhash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(encodedhash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not found", e);
        }
    }

    /**
     * Converts a byte array into a human-readable Hex string.
     * 
     * @param hash The raw byte array
     * @return Concatenated hex representation
     */
    private static String bytesToHex(byte[] hash) {
        StringBuilder hexString = new StringBuilder(2 * hash.length);
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }
}
