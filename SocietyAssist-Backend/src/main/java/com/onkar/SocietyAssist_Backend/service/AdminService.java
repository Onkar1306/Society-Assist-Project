package com.onkar.SocietyAssist_Backend.service;

import com.onkar.SocietyAssist_Backend.entity.Admin;
import com.onkar.SocietyAssist_Backend.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    // Register new Admin
    public Admin registerAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    // Authenticate Admin Login
    public Admin loginAdmin(String email, String password) {
        Admin admin = adminRepository.findByEmail(email);
        if (admin.getPassword().equals(password)) {
            return admin;
        }
        return null;
    }
}
