package com.keystone.realestate.repository;

import com.keystone.realestate.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, String> {
    Optional<Project> findBySlug(String slug);
    Optional<Project> findByIdOrSlug(String id, String slug);

    long countByStatus(String status);

    @Query("SELECT p FROM Project p WHERE " +
           "(:publishedOnly = false OR p.published = true) AND " +
           "(:featuredOnly = false OR p.featured = true) AND " +
           "(:type IS NULL OR p.type = :type) AND " +
           "(:status IS NULL OR p.status = :status) AND " +
           "(:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.city) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.area) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY p.createdAt DESC")
    List<Project> searchProjects(
            @Param("publishedOnly") boolean publishedOnly,
            @Param("featuredOnly") boolean featuredOnly,
            @Param("type") String type,
            @Param("status") String status,
            @Param("search") String search
    );
}
