package com.onkar.SocietyAssist_Backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import java.util.Date;


@Entity
@Data
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String category;
    private String description;
    private Date date;

    private Long flatOwnerId;

    public Complaint(){

    }

    public Complaint(Long id, String category, String description, Date date, Long flatOwnerId) {
        this.id = id;
        this.category = category;
        this.description = description;
        this.date = date;
        this.flatOwnerId = flatOwnerId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Long getFlatOwnerId() {
        return flatOwnerId;
    }

    public void setFlatOwnerId(Long flatOwnerId) {
        this.flatOwnerId = flatOwnerId;
    }
}
