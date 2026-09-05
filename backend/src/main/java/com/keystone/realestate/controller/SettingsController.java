package com.keystone.realestate.controller;

import com.keystone.realestate.model.SiteSettings;
import com.keystone.realestate.repository.SiteSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    @Autowired
    private SiteSettingsRepository settingsRepository;

    @GetMapping
    public ResponseEntity<?> getSettings() {
        Optional<SiteSettings> settingsOpt = settingsRepository.findById("site_settings");
        SiteSettings settings = settingsOpt.orElseGet(() -> SiteSettings.builder()
                .id("site_settings")
                .companyName("Shri Shyam Associate")
                .phone("+91 9911956274")
                .whatsapp("+91 9911956274")
                .email("shrishyamproperties001@gmail.com")
                .address("Shop No. 247, 2nd Floor, Vardhaman City Mall, Vaishali, Sector 7, Dwarka, Delhi - 110077")
                .googleMapsUrl("https://maps.google.com/maps?q=Shop+247+Vardhaman+City+Mall+Sector+7+Dwarka+Delhi&t=&z=15&ie=UTF8&iwloc=&output=embed")
                .workingHours("Monday - Sunday: Open 24 Hours (24/7)")
                .siteTitle("Shri Shyam Associate | Home Builder & Real Estate in Sector 7 Dwarka, Delhi")
                .siteDescription("Shri Shyam Associate is a premier Home Builder and Real Estate Consultant in Sector 7, Dwarka, Delhi. Located at Shop No 247, 2nd Floor, Vardhaman City Mall. Call +91 9911956274.")
                .projectsDelivered("48+")
                .yearsExperience("15+")
                .happyCustomers("12,500+")
                .ongoingProjects("12")
                .build());

        return ResponseEntity.ok(Map.of("settings", settings));
    }

    @PutMapping
    public ResponseEntity<?> updateSettings(@RequestBody Map<String, String> body) {
        SiteSettings settings = settingsRepository.findById("site_settings")
                .orElseGet(() -> SiteSettings.builder().id("site_settings").build());

        if (body.containsKey("companyName")) settings.setCompanyName(body.get("companyName"));
        if (body.containsKey("phone")) settings.setPhone(body.get("phone"));
        if (body.containsKey("whatsapp")) settings.setWhatsapp(body.get("whatsapp"));
        if (body.containsKey("email")) settings.setEmail(body.get("email"));
        if (body.containsKey("address")) settings.setAddress(body.get("address"));
        if (body.containsKey("googleMapsUrl")) settings.setGoogleMapsUrl(body.get("googleMapsUrl"));
        if (body.containsKey("workingHours")) settings.setWorkingHours(body.get("workingHours"));
        if (body.containsKey("siteTitle")) settings.setSiteTitle(body.get("siteTitle"));
        if (body.containsKey("siteDescription")) settings.setSiteDescription(body.get("siteDescription"));
        if (body.containsKey("projectsDelivered")) settings.setProjectsDelivered(body.get("projectsDelivered"));
        if (body.containsKey("yearsExperience")) settings.setYearsExperience(body.get("yearsExperience"));
        if (body.containsKey("happyCustomers")) settings.setHappyCustomers(body.get("happyCustomers"));
        if (body.containsKey("ongoingProjects")) settings.setOngoingProjects(body.get("ongoingProjects"));

        SiteSettings saved = settingsRepository.save(settings);
        return ResponseEntity.ok(Map.of("success", true, "message", "Site settings saved", "settings", saved));
    }
}
