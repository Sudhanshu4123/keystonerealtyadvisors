package com.keystone.realestate.repository;

import com.keystone.realestate.model.Testimonial;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TestimonialRepository extends JpaRepository<Testimonial, String> {
    List<Testimonial> findByPublishedTrueOrderByCreatedAtDesc();
    List<Testimonial> findAllByOrderByCreatedAtDesc();
}
