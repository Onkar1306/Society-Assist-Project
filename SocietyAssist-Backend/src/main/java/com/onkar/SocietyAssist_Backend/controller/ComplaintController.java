package com.onkar.SocietyAssist_Backend.controller;

import com.onkar.SocietyAssist_Backend.entity.Complaint;
import com.onkar.SocietyAssist_Backend.service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/complaint")
@CrossOrigin("*")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    // Add Complaint
    @PostMapping("/add")
    public Complaint addComplaint(@RequestBody Complaint complaint) {
        return complaintService.addComplaint(complaint);
    }

    // Get All Complaints
    @GetMapping("/all")
    public List<Complaint> getAllComplaints() {
        return complaintService.getAllComplaints();
    }

    // Delete Complaint
    @DeleteMapping("/delete/{id}")
    public void deleteComplaint(@PathVariable Long id) {
        complaintService.deleteComplaint(id);
    }

    // Get All Complaints By ID
    @GetMapping("/allComplaints/{flatOwnerId}")
    public List<Complaint> getAllComplaintsByFlatOwnerId(@PathVariable Long flatOwnerId) {
        return complaintService.getAllComplaintsByFlatOwnerId(flatOwnerId);

    }
}
