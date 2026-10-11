package com.onkar.SocietyAssist_Backend.controller;

import com.onkar.SocietyAssist_Backend.entity.FlatOwner;
import com.onkar.SocietyAssist_Backend.service.FlatOwnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/flatowner")
@CrossOrigin("*")
public class FlatOwnerController {

    @Autowired
    private FlatOwnerService flatOwnerService;

    // Add FlatOwner
    @PostMapping("/add")
    public FlatOwner addFlatOwner(@RequestBody FlatOwner flatOwner) {
        return flatOwnerService.addFlatOwner(flatOwner);
    }

    // Get All FlatOwners
    @GetMapping("/all")
    public List<FlatOwner> getAllFlatOwners() {
        return flatOwnerService.getAllFlatOwners();
    }

    // Login FlatOwner
    @PostMapping("/login")
    public FlatOwner loginFlatOwner(@RequestParam String flatNo, @RequestParam String password) {
        return flatOwnerService.loginFlatOwner(flatNo, password);
    }

    // Delete FlatOwner
    @DeleteMapping("/delete/{id}")
    public void deleteFlatOwner(@PathVariable Long id) {
        flatOwnerService.deleteFlatOwner(id);
    }
}
