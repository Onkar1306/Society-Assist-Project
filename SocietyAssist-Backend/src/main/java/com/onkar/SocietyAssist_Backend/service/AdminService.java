package com.onkar.SocietyAssist_Backend.service;

import com.onkar.SocietyAssist_Backend.entity.Admin;
import com.onkar.SocietyAssist_Backend.repository.AdminRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Optional;

@Service
public class AdminService {
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminService(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Admin registerAdmin(Admin admin) {
        admin.setPassword(encodeIfNecessary(admin.getPassword()));
        return adminRepository.save(admin);
    }

    public Optional<Admin> loginAdmin(String email, String password) {
        Admin admin = adminRepository.findByEmail(email);
        return passwordMatchesAndUpgrade(admin, password) ? Optional.of(admin) : Optional.empty();
    }

    public boolean hasRegisteredAdmin() {
        return adminRepository.count() > 0;
    }

    private String encodeIfNecessary(String password) {
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }
        return isBcryptHash(password) ? password : passwordEncoder.encode(password);
    }

    private boolean passwordMatchesAndUpgrade(Admin admin, String suppliedPassword) {
        if (admin == null || suppliedPassword == null || admin.getPassword() == null) {
            return false;
        }
        if (isBcryptHash(admin.getPassword())) {
            return passwordEncoder.matches(suppliedPassword, admin.getPassword());
        }
        boolean matches = MessageDigest.isEqual(
                admin.getPassword().getBytes(StandardCharsets.UTF_8),
                suppliedPassword.getBytes(StandardCharsets.UTF_8));
        if (matches) {
            admin.setPassword(passwordEncoder.encode(suppliedPassword));
            adminRepository.save(admin);
        }
        return matches;
    }

    private boolean isBcryptHash(String value) {
        return value.matches("^\\$2[aby]\\$\\d{2}\\$.*");
    }
}
