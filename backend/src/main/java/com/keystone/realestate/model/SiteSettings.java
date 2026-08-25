package com.keystone.realestate.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "site_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SiteSettings {

    @Id
    private String id; // Single record key: 'site_settings'

    private String companyName;
    private String phone;
    private String whatsapp;
    private String email;

    @Column(length = 1000)
    private String address;

    @Column(length = 2000)
    private String googleMapsUrl;

    private String workingHours;

    private String siteTitle;

    @Column(length = 1000)
    private String siteDescription;

    private String projectsDelivered;
    private String yearsExperience;
    private String happyCustomers;
    private String ongoingProjects;

    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
