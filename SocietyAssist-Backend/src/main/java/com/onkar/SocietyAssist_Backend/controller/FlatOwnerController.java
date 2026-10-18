package com.onkar.SocietyAssist_Backend.controller;

import com.onkar.SocietyAssist_Backend.dto.AuthenticationResponse;
import com.onkar.SocietyAssist_Backend.entity.FlatOwner;
import com.onkar.SocietyAssist_Backend.security.JwtService;
import com.onkar.SocietyAssist_Backend.security.Role;
import com.onkar.SocietyAssist_Backend.service.FlatOwnerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/flatowner")
@CrossOrigin("*")
public class FlatOwnerController {
    private final FlatOwnerService flatOwnerService;
    private final JwtService jwtService;

    public FlatOwnerController(FlatOwnerService flatOwnerService, JwtService jwtService) {
        this.flatOwnerService = flatOwnerService;
        this.jwtService = jwtService;
    }

    @PostMapping("/add")
    public FlatOwner addFlatOwner(@RequestBody FlatOwner flatOwner) {
        return flatOwnerService.addFlatOwner(flatOwner);
    }

    @GetMapping("/all")
    public List<FlatOwner> getAllFlatOwners() {
        return flatOwnerService.getAllFlatOwners();
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> loginFlatOwner(@RequestParam String flatNo, @RequestParam String password) {
        return flatOwnerService.loginFlatOwner(flatNo, password)
                .map(owner -> ResponseEntity.ok(new AuthenticationResponse(
                        jwtService.generateToken(owner.getId(), Role.FLAT_OWNER, owner.getFlatNo()), "Bearer", Role.FLAT_OWNER, owner.getId())))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    @DeleteMapping("/delete/{id}")
    public void deleteFlatOwner(@PathVariable Long id) {
        flatOwnerService.deleteFlatOwner(id);
    }
}
