package com.onkar.SocietyAssist_Backend.controller;

import com.onkar.SocietyAssist_Backend.dto.AuthenticationResponse;
import com.onkar.SocietyAssist_Backend.entity.Admin;
import com.onkar.SocietyAssist_Backend.security.AuthenticatedUser;
import com.onkar.SocietyAssist_Backend.security.JwtService;
import com.onkar.SocietyAssist_Backend.security.Role;
import com.onkar.SocietyAssist_Backend.service.AdminService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
@CrossOrigin("*")
public class AdminController {
    private final AdminService adminService;
    private final JwtService jwtService;
    private final String bootstrapToken;

    public AdminController(AdminService adminService, JwtService jwtService,
                           @Value("${ADMIN_BOOTSTRAP_TOKEN:}") String bootstrapToken) {
        this.adminService = adminService;
        this.jwtService = jwtService;
        this.bootstrapToken = bootstrapToken;
    }

    @PostMapping("/register")
    public Admin registerAdmin(@RequestBody Admin admin,
                               @RequestHeader(value = "X-Admin-Bootstrap-Token", required = false) String suppliedBootstrapToken,
                               Authentication authentication) {
        if (adminService.hasRegisteredAdmin()) {
            if (!isAdmin(authentication)) {
                throw new AccessDeniedException("Only an administrator can register another administrator");
            }
        } else if (bootstrapToken.isBlank() || !bootstrapToken.equals(suppliedBootstrapToken)) {
            throw new AccessDeniedException("A valid bootstrap token is required to register the first administrator");
        }
        return adminService.registerAdmin(admin);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> loginAdmin(@RequestParam String email, @RequestParam String password) {
        return adminService.loginAdmin(email, password)
                .map(admin -> ResponseEntity.ok(new AuthenticationResponse(
                        jwtService.generateToken(admin.getId(), Role.ADMIN, admin.getEmail()), "Bearer", Role.ADMIN, admin.getId())))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication != null
                && authentication.getPrincipal() instanceof AuthenticatedUser user
                && user.role() == Role.ADMIN;
    }
}
