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
                .companyName("Keystone Real Estate Developments")
                .phone("+91 9217668175")
                .whatsapp("+91 9217668175")
                .email("shrishyamproperties001@gmail.com")
                .address("Vardhaman City Mall, Dwarka, Delhi")
                .googleMapsUrl("https://maps.google.com/maps?q=Vardhaman+City+Mall+Dwarka+Delhi&t=&z=14&ie=UTF8&iwloc=&output=embed")
                .workingHours("Monday - Sunday: 9:00 AM - 8:00 PM (7 Days Open)")
                .siteTitle("Keystone | Premium Real Estate Projects Showcase")
                .siteDescription("Explore luxury residential and commercial developments built for modern living and lasting value.")
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
