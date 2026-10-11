package com.onkar.SocietyAssist_Backend.repository;

import com.onkar.SocietyAssist_Backend.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NoticeRepository extends JpaRepository<Notice,Long> {
}
