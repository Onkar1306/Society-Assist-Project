package com.onkar.SocietyAssist_Backend.controller;

import com.onkar.SocietyAssist_Backend.entity.Notice;
import com.onkar.SocietyAssist_Backend.service.NoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notice")
@CrossOrigin("*")
public class NoticeController {

    @Autowired
    private NoticeService noticeService;

    // Add Notice
    @PostMapping("/add")
    public Notice addNotice(@RequestBody Notice notice) {
        return noticeService.addNotice(notice);
    }

    // Get All Notices
    @GetMapping
    public List<Notice> getAllNotices() {
        return noticeService.getAllNotices();
    }

    // Delete Notice
    @DeleteMapping("/delete/{id}")
    public void deleteNotice(@PathVariable Long id) {
        noticeService.deleteNotice(id);
    }
}
