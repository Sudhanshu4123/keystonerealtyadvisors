package com.keystone.realestate.controller;

import com.keystone.realestate.model.Inquiry;
import com.keystone.realestate.model.Project;
import com.keystone.realestate.repository.InquiryRepository;
import com.keystone.realestate.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/inquiries")
public class InquiryController {

    @Autowired
    private InquiryRepository inquiryRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @GetMapping
    public ResponseEntity<List<Inquiry>> getInquiries(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search
    ) {
        String statusParam = (status != null && !"ALL".equalsIgnoreCase(status)) ? status : null;
        String searchParam = (search != null && !search.trim().isEmpty()) ? search.trim() : null;

        List<Inquiry> inquiries = inquiryRepository.searchInquiries(statusParam, searchParam);
        return ResponseEntity.ok(inquiries);
    }

    @PostMapping
    public ResponseEntity<?> createInquiry(@RequestBody Map<String, Object> body) {
        String name = (String) body.get("name");
        String phone = (String) body.get("phone");
        String message = (String) body.get("message");

        if (name == null || phone == null || message == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Name, phone number and message are required"));
        }

        Inquiry inquiry = Inquiry.builder()
                .name(name.trim())
                .phone(phone.trim())
                .email(body.get("email") != null ? ((String) body.get("email")).trim() : "")
                .message(message.trim())
                .preferredContact(body.get("preferredContact") != null ? (String) body.get("preferredContact") : "PHONE")
                .visitDate((String) body.get("visitDate"))
                .status("NEW")
                .build();

        if (body.get("projectId") != null) {
            String projId = (String) body.get("projectId");
            Optional<Project> projOpt = projectRepository.findById(projId);
            projOpt.ifPresent(inquiry::setProject);
        }

        Inquiry saved = inquiryRepository.save(inquiry);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "success", true,
                "message", "Inquiry submitted successfully. Our team will contact you shortly.",
                "inquiry", saved
        ));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateInquiryStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        if (newStatus == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Status is required"));
        }

        Optional<Inquiry> inquiryOpt = inquiryRepository.findById(id);
        if (inquiryOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Inquiry not found"));
        }

        Inquiry inquiry = inquiryOpt.get();
        inquiry.setStatus(newStatus);
        Inquiry updated = inquiryRepository.save(inquiry);

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInquiry(@PathVariable String id) {
        if (!inquiryRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Inquiry not found"));
        }
        inquiryRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Inquiry deleted"));
    }
}
