package com.keystone.realestate.controller;

import com.keystone.realestate.model.*;
import com.keystone.realestate.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    private String generateSlug(String name) {
        if (name == null) return "project-" + System.currentTimeMillis();
        return name.toLowerCase()
                .trim()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-");
    }

    @GetMapping
    public ResponseEntity<List<Project>> getProjects(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String location,
            @RequestParam(required = false, defaultValue = "false") Boolean featured,
            @RequestParam(required = false, defaultValue = "true") Boolean publishedOnly
    ) {
        String searchParam = (search != null && !search.trim().isEmpty()) ? search.trim() :
                             (location != null && !location.trim().isEmpty()) ? location.trim() : null;
        String typeParam = (type != null && !"ALL".equalsIgnoreCase(type)) ? type : null;
        String statusParam = (status != null && !"ALL".equalsIgnoreCase(status)) ? status : null;

        List<Project> projects = projectRepository.searchProjects(
                publishedOnly != null ? publishedOnly : true,
                featured != null ? featured : false,
                typeParam,
                statusParam,
                searchParam
        );

        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{idOrSlug}")
    public ResponseEntity<?> getProjectByIdOrSlug(@PathVariable String idOrSlug) {
        Optional<Project> projectOpt = projectRepository.findByIdOrSlug(idOrSlug, idOrSlug);
        if (projectOpt.isEmpty()) {
            projectOpt = projectRepository.findBySlug(idOrSlug);
        }

        if (projectOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Project not found"));
        }

        return ResponseEntity.ok(projectOpt.get());
    }

    @PostMapping
    @SuppressWarnings("unchecked")
    public ResponseEntity<?> createProject(@RequestBody Map<String, Object> body) {
        try {
            String name = (String) body.get("name");
            String shortDescription = (String) body.get("shortDescription");
            if (name == null || name.trim().isEmpty() || shortDescription == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Name and shortDescription are required"));
            }

            String baseSlug = body.get("slug") != null ? generateSlug((String) body.get("slug")) : generateSlug(name);
            String finalSlug = baseSlug;
            if (projectRepository.findBySlug(baseSlug).isPresent()) {
                finalSlug = baseSlug + "-" + (System.currentTimeMillis() % 10000);
            }

            Project project = Project.builder()
                    .name(name)
                    .slug(finalSlug)
                    .type((String) body.getOrDefault("type", "Residential"))
                    .status((String) body.getOrDefault("status", "Ongoing"))
                    .shortDescription(shortDescription)
                    .description((String) body.get("description"))
                    .developer((String) body.getOrDefault("developer", "Keystone Developments"))
                    .address((String) body.get("address"))
                    .area((String) body.get("area"))
                    .city((String) body.get("city"))
                    .state((String) body.getOrDefault("state", "Delhi"))
                    .pincode((String) body.getOrDefault("pincode", "110075"))
                    .totalArea((String) body.get("totalArea"))
                    .buildings(body.get("buildings") != null ? Integer.parseInt(body.get("buildings").toString()) : null)
                    .floors(body.get("floors") != null ? Integer.parseInt(body.get("floors").toString()) : null)
                    .units(body.get("units") != null ? Integer.parseInt(body.get("units").toString()) : null)
                    .completionDate((String) body.get("completionDate"))
                    .featured(Boolean.TRUE.equals(body.get("featured")))
                    .published(body.get("published") == null || Boolean.TRUE.equals(body.get("published")))
                    .seoTitle((String) body.get("seoTitle"))
                    .metaDescription((String) body.get("metaDescription"))
                    .build();

            // Images
            if (body.get("images") instanceof List<?> imgList) {
                List<ProjectImage> images = new ArrayList<>();
                int idx = 0;
                for (Object imgObj : imgList) {
                    String url = imgObj instanceof Map map ? (String) map.get("imageUrl") : imgObj.toString();
                    if (url != null && !url.trim().isEmpty()) {
                        images.add(ProjectImage.builder()
                                .project(project)
                                .imageUrl(url)
                                .isPrimary(idx == 0)
                                .sortOrder(idx++)
                                .build());
                    }
                }
                project.setImages(images);
            }

            // Amenities
            if (body.get("amenities") instanceof List<?> amList) {
                List<ProjectAmenity> amenities = new ArrayList<>();
                for (Object amObj : amList) {
                    String amName = amObj instanceof Map map ? (String) map.get("name") : amObj.toString();
                    if (amName != null && !amName.trim().isEmpty()) {
                        amenities.add(ProjectAmenity.builder().project(project).name(amName).build());
                    }
                }
                project.setAmenities(amenities);
            }

            // Brochures
            if (body.get("brochures") instanceof List<?> brList) {
                List<Brochure> brochures = new ArrayList<>();
                for (Object brObj : brList) {
                    if (brObj instanceof Map map) {
                        String fName = map.get("fileName") != null ? (String) map.get("fileName") : "Brochure.pdf";
                        String fUrl = (String) map.get("fileUrl");
                        if (fUrl != null) {
                            brochures.add(Brochure.builder().project(project).fileName(fName).fileUrl(fUrl).build());
                        }
                    }
                }
                project.setBrochures(brochures);
            }

            Project saved = projectRepository.save(project);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", ex.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProject(@PathVariable String id, @RequestBody Map<String, Object> body) {
        Optional<Project> projectOpt = projectRepository.findById(id);
        if (projectOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Project not found"));
        }

        Project existing = projectOpt.get();
        if (body.containsKey("name")) existing.setName((String) body.get("name"));
        if (body.containsKey("type")) existing.setType((String) body.get("type"));
        if (body.containsKey("status")) existing.setStatus((String) body.get("status"));
        if (body.containsKey("shortDescription")) existing.setShortDescription((String) body.get("shortDescription"));
        if (body.containsKey("description")) existing.setDescription((String) body.get("description"));
        if (body.containsKey("developer")) existing.setDeveloper((String) body.get("developer"));
        if (body.containsKey("address")) existing.setAddress((String) body.get("address"));
        if (body.containsKey("area")) existing.setArea((String) body.get("area"));
        if (body.containsKey("city")) existing.setCity((String) body.get("city"));
        if (body.containsKey("state")) existing.setState((String) body.get("state"));
        if (body.containsKey("pincode")) existing.setPincode((String) body.get("pincode"));
        if (body.containsKey("totalArea")) existing.setTotalArea((String) body.get("totalArea"));
        if (body.containsKey("completionDate")) existing.setCompletionDate((String) body.get("completionDate"));
        if (body.containsKey("featured")) existing.setFeatured(Boolean.TRUE.equals(body.get("featured")));
        if (body.containsKey("published")) existing.setPublished(Boolean.TRUE.equals(body.get("published")));

        Project updated = projectRepository.save(existing);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable String id) {
        if (!projectRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Project not found"));
        }
        projectRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Project deleted successfully"));
    }
}
