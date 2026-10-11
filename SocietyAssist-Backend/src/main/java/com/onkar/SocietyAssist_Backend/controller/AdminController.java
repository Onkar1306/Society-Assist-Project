package com.onkar.SocietyAssist_Backend.controller;

import com.onkar.SocietyAssist_Backend.entity.Admin;
import com.onkar.SocietyAssist_Backend.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@CrossOrigin("*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // Register Admin
    @PostMapping("/register")
    public Admin registerAdmin(@RequestBody Admin admin) {
        return adminService.registerAdmin(admin);
    }

    // Login Admin
    @PostMapping("/login")
    public Admin loginAdmin(@RequestParam String email, @RequestParam String password) {
        return adminService.loginAdmin(email, password);

    }
}
