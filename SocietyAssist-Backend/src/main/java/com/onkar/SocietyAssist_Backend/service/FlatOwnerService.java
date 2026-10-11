package com.onkar.SocietyAssist_Backend.service;

import com.onkar.SocietyAssist_Backend.entity.FlatOwner;
import com.onkar.SocietyAssist_Backend.repository.FlatOwnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FlatOwnerService {

    @Autowired
    private FlatOwnerRepository flatOwnerRepository;

    // Add a new FlatOwner
    public FlatOwner addFlatOwner(FlatOwner flatOwner) {
        return flatOwnerRepository.save(flatOwner);
    }

    // Get all FlatOwners
    public List<FlatOwner> getAllFlatOwners() {
        return flatOwnerRepository.findAll();
    }

    // Authenticate FlatOwner Login
    public FlatOwner loginFlatOwner(String flatNo, String password) {
        FlatOwner owner = flatOwnerRepository.findByFlatNo(flatNo);
        if (owner != null && owner.getPassword().equals(password)) {
            return owner;
        }
        return null;
    }

    // Delete FlatOwner
    public void deleteFlatOwner(Long id) {
        flatOwnerRepository.deleteById(id);
    }
}
