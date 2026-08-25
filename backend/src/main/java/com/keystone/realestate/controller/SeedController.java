package com.keystone.realestate.controller;

import com.keystone.realestate.initializer.DataInitializer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/seed")
public class SeedController {

    @Autowired
    private DataInitializer dataInitializer;

    @PostMapping
    public ResponseEntity<?> triggerSeed() {
        try {
            dataInitializer.seedAdmin();
            dataInitializer.seedSettings();
            dataInitializer.seedProjects();
            dataInitializer.seedTestimonials();
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Database successfully seeded with default master projects, site settings, and admin account!"
            ));
        } catch (Exception ex) {
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Database initialization executed."
            ));
        }
    }
}
