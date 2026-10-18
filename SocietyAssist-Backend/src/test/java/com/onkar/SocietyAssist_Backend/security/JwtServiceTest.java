package com.onkar.SocietyAssist_Backend.security;

import io.jsonwebtoken.ExpiredJwtException;
import org.junit.jupiter.api.Test;

import java.security.SecureRandom;
import java.util.Base64;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class JwtServiceTest {
    @Test
    void generatesAndParsesSignedToken() {
        JwtService service = new JwtService(testSecret(), 3_600_000);
        String token = service.generateToken(42L, Role.FLAT_OWNER, "A-101");

        AuthenticatedUser user = service.parseToken(token);

        assertEquals(42L, user.id());
        assertEquals(Role.FLAT_OWNER, user.role());
    }

    @Test
    void rejectsExpiredToken() {
        JwtService service = new JwtService(testSecret(), -1);
        String token = service.generateToken(1L, Role.ADMIN, "admin@example.com");

        assertThrows(ExpiredJwtException.class, () -> service.parseToken(token));
    }

    private String testSecret() {
        byte[] bytes = new byte[32];
        new SecureRandom().nextBytes(bytes);
        return Base64.getEncoder().encodeToString(bytes);
    }
}
