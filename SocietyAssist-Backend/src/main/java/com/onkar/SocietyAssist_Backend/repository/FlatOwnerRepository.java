package com.onkar.SocietyAssist_Backend.repository;

import com.onkar.SocietyAssist_Backend.entity.FlatOwner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FlatOwnerRepository extends JpaRepository<FlatOwner, Long> {
    FlatOwner findByFlatNo(String flatNo);
}
