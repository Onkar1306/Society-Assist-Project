package com.onkar.SocietyAssist_Backend.service;

import com.onkar.SocietyAssist_Backend.entity.Notice;
import com.onkar.SocietyAssist_Backend.repository.NoticeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoticeService {

    @Autowired
    private NoticeRepository noticeRepository;

    // Add a new Notice
    public Notice addNotice(Notice notice) {
        return noticeRepository.save(notice);
    }


    // Get all Notices
    public List<Notice> getAllNotices() {
        return noticeRepository.findAll();
    }

    // Delete Notice by ID
    public void deleteNotice(Long id) {
        noticeRepository.deleteById(id);
    }



}
