package com.onkar.SocietyAssist_Backend.service;

import com.onkar.SocietyAssist_Backend.entity.Complaint;
import com.onkar.SocietyAssist_Backend.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    // Add a new Complaint
    public Complaint addComplaint(Complaint complaint) {
        return complaintRepository.save(complaint);
    }

    // Get all Complaints
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    // Delete Complaint by ID
    public void deleteComplaint(Long id) {
        complaintRepository.deleteById(id);
    }

    // Get All Complaints By ID
    public List<Complaint> getAllComplaintsByFlatOwnerId(Long flatOwnerId) {
        return complaintRepository.findByFlatOwnerId(flatOwnerId);
    }
}
