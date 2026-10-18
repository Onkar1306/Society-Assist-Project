package com.onkar.SocietyAssist_Backend.service;

import com.onkar.SocietyAssist_Backend.entity.Admin;
import com.onkar.SocietyAssist_Backend.repository.AdminRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.lang.reflect.Proxy;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class AdminServiceTest {
    @Test
    void upgradesMatchingLegacyPlaintextPasswordOnLogin() {
        PasswordEncoder encoder = new BCryptPasswordEncoder();
        Admin admin = new Admin(1L, "Secretary", "secretary@example.com", "legacy-password");
        AtomicReference<Admin> saved = new AtomicReference<>();
        AdminService service = new AdminService(repositoryFor(admin, saved), encoder);

        Optional<Admin> result = service.loginAdmin(admin.getEmail(), "legacy-password");

        assertTrue(result.isPresent());
        assertTrue(encoder.matches("legacy-password", admin.getPassword()));
        assertEquals(admin, saved.get());
    }

    @Test
    void doesNotHashAnExistingBcryptPasswordAgain() {
        PasswordEncoder encoder = new BCryptPasswordEncoder();
        String existingHash = encoder.encode("already-secure");
        Admin admin = new Admin(null, "Secretary", "secretary@example.com", existingHash);
        AtomicReference<Admin> saved = new AtomicReference<>();
        AdminService service = new AdminService(repositoryFor(null, saved), encoder);

        service.registerAdmin(admin);

        assertEquals(existingHash, admin.getPassword());
        assertEquals(admin, saved.get());
    }

    private AdminRepository repositoryFor(Admin foundAdmin, AtomicReference<Admin> saved) {
        return (AdminRepository) Proxy.newProxyInstance(
                AdminRepository.class.getClassLoader(),
                new Class<?>[]{AdminRepository.class},
                (proxy, method, arguments) -> switch (method.getName()) {
                    case "findByEmail" -> foundAdmin;
                    case "save" -> {
                        Admin admin = (Admin) arguments[0];
                        saved.set(admin);
                        yield admin;
                    }
                    case "count" -> 0L;
                    default -> throw new UnsupportedOperationException(method.getName());
                });
    }
}
