package com.onkar.SocietyAssist_Backend.service;

import com.onkar.SocietyAssist_Backend.entity.FlatOwner;
import com.onkar.SocietyAssist_Backend.repository.FlatOwnerRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.List;
import java.util.Optional;

@Service
public class FlatOwnerService {
    private final FlatOwnerRepository flatOwnerRepository;
    private final PasswordEncoder passwordEncoder;

    public FlatOwnerService(FlatOwnerRepository flatOwnerRepository, PasswordEncoder passwordEncoder) {
        this.flatOwnerRepository = flatOwnerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public FlatOwner addFlatOwner(FlatOwner flatOwner) {
        flatOwner.setPassword(encodeIfNecessary(flatOwner.getPassword()));
        return flatOwnerRepository.save(flatOwner);
    }

    public List<FlatOwner> getAllFlatOwners() {
        return flatOwnerRepository.findAll();
    }

    public Optional<FlatOwner> loginFlatOwner(String flatNo, String password) {
        FlatOwner owner = flatOwnerRepository.findByFlatNo(flatNo);
        return passwordMatchesAndUpgrade(owner, password) ? Optional.of(owner) : Optional.empty();
    }

    public void deleteFlatOwner(Long id) {
        flatOwnerRepository.deleteById(id);
    }

    private String encodeIfNecessary(String password) {
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }
        return isBcryptHash(password) ? password : passwordEncoder.encode(password);
    }

    private boolean passwordMatchesAndUpgrade(FlatOwner owner, String suppliedPassword) {
        if (owner == null || suppliedPassword == null || owner.getPassword() == null) {
            return false;
        }
        if (isBcryptHash(owner.getPassword())) {
            return passwordEncoder.matches(suppliedPassword, owner.getPassword());
        }
        boolean matches = MessageDigest.isEqual(
                owner.getPassword().getBytes(StandardCharsets.UTF_8),
                suppliedPassword.getBytes(StandardCharsets.UTF_8));
        if (matches) {
            owner.setPassword(passwordEncoder.encode(suppliedPassword));
            flatOwnerRepository.save(owner);
        }
        return matches;
    }

    private boolean isBcryptHash(String value) {
        return value.matches("^\\$2[aby]\\$\\d{2}\\$.*");
    }
}
