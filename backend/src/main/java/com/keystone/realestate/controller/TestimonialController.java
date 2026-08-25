package com.keystone.realestate.controller;

import com.keystone.realestate.model.Testimonial;
import com.keystone.realestate.repository.TestimonialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/testimonials")
public class TestimonialController {

    @Autowired
    private TestimonialRepository testimonialRepository;

    @GetMapping
    public ResponseEntity<?> getTestimonials(@RequestParam(required = false, defaultValue = "false") Boolean publishedOnly) {
        List<Testimonial> testimonials = Boolean.TRUE.equals(publishedOnly)
                ? testimonialRepository.findByPublishedTrueOrderByCreatedAtDesc()
                : testimonialRepository.findAllByOrderByCreatedAtDesc();

        return ResponseEntity.ok(testimonials);
    }

    @PostMapping
    public ResponseEntity<?> createTestimonial(@RequestBody Map<String, Object> body) {
        String name = (String) body.get("name");
        String review = (String) body.get("review");

        if (name == null || review == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Name and review are required"));
        }

        Testimonial testimonial = Testimonial.builder()
                .name(name.trim())
                .designation((String) body.getOrDefault("designation", "Valued Client"))
                .review(review.trim())
                .image((String) body.get("image"))
                .published(body.get("published") == null || Boolean.TRUE.equals(body.get("published")))
                .build();

        Testimonial saved = testimonialRepository.save(testimonial);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTestimonial(@PathVariable String id, @RequestBody Map<String, Object> body) {
        Optional<Testimonial> tOpt = testimonialRepository.findById(id);
        if (tOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Testimonial not found"));
        }

        Testimonial existing = tOpt.get();
        if (body.containsKey("name")) existing.setName((String) body.get("name"));
        if (body.containsKey("designation")) existing.setDesignation((String) body.get("designation"));
        if (body.containsKey("review")) existing.setReview((String) body.get("review"));
        if (body.containsKey("image")) existing.setImage((String) body.get("image"));
        if (body.containsKey("published")) existing.setPublished(Boolean.TRUE.equals(body.get("published")));

        Testimonial saved = testimonialRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTestimonial(@PathVariable String id) {
        if (!testimonialRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Testimonial not found"));
        }
        testimonialRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Testimonial deleted"));
    }
}
