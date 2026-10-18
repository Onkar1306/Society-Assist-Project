package com.onkar.SocietyAssist_Backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {
    private final String jwtSecret;
    private final long expirationMs;

    public JwtService(@Value("${JWT_SECRET}") String jwtSecret,
                      @Value("${JWT_EXPIRATION_MS:3600000}") long expirationMs) {
        this.jwtSecret = jwtSecret;
        this.expirationMs = expirationMs;
    }

    public String generateToken(Long userId, Role role, String subject) {
        Date now = new Date();
        return Jwts.builder()
                .subject(subject)
                .claim("userId", userId)
                .claim("role", role.name())
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expirationMs))
                .signWith(signingKey())
                .compact();
    }

    public AuthenticatedUser parseToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(signingKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        Number userId = claims.get("userId", Number.class);
        String role = claims.get("role", String.class);
        if (userId == null || role == null) {
            throw new IllegalArgumentException("Token is missing required claims");
        }
        return new AuthenticatedUser(userId.longValue(), Role.valueOf(role));
    }

    private SecretKey signingKey() {
        byte[] key = Decoders.BASE64.decode(jwtSecret);
        if (key.length < 32) {
            throw new IllegalStateException("JWT_SECRET must be Base64-encoded and at least 32 bytes long");
        }
        return Keys.hmacShaKeyFor(key);
    }
}
