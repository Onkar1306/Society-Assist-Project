package com.onkar.SocietyAssist_Backend.repository;

import com.onkar.SocietyAssist_Backend.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint,Long> {
    List<Complaint> findByFlatOwnerId(Long flatOwnerId);
}

