package com.onkar.SocietyAssist_Backend.controller;

import com.onkar.SocietyAssist_Backend.entity.Complaint;
import com.onkar.SocietyAssist_Backend.security.AuthenticatedUser;
import com.onkar.SocietyAssist_Backend.security.Role;
import com.onkar.SocietyAssist_Backend.service.ComplaintService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/complaint")
@CrossOrigin("*")
public class ComplaintController {
    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @PostMapping("/add")
    public Complaint addComplaint(@RequestBody Complaint complaint, Authentication authentication) {
        complaint.setFlatOwnerId(currentUser(authentication).id());
        return complaintService.addComplaint(complaint);
    }

    @GetMapping("/all")
    public List<Complaint> getAllComplaints() {
        return complaintService.getAllComplaints();
    }

    @DeleteMapping("/delete/{id}")
    public void deleteComplaint(@PathVariable Long id) {
        complaintService.deleteComplaint(id);
    }

    @GetMapping("/allComplaints/{flatOwnerId}")
    public List<Complaint> getAllComplaintsByFlatOwnerId(@PathVariable Long flatOwnerId, Authentication authentication) {
        AuthenticatedUser user = currentUser(authentication);
        if (user.role() == Role.FLAT_OWNER && !user.id().equals(flatOwnerId)) {
            throw new AccessDeniedException("Flat owners can access only their own complaints");
        }
        return complaintService.getAllComplaintsByFlatOwnerId(flatOwnerId);
    }

    private AuthenticatedUser currentUser(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof AuthenticatedUser user)) {
            throw new AccessDeniedException("Authentication is required");
        }
        return user;
    }
}
