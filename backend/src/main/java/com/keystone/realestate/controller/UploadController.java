package com.keystone.realestate.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import java.util.*;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    @Value("${app.upload-dir:public/uploads}")
    private String uploadDirStr;

    @PostMapping
    public ResponseEntity<?> uploadFiles(@RequestParam("files") MultipartFile[] files) {
        if (files == null || files.length == 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "No files uploaded"));
        }

        List<Map<String, Object>> uploadedFiles = new ArrayList<>();

        try {
            File uploadDir = new File(uploadDirStr);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            for (MultipartFile file : files) {
                if (file.isEmpty()) continue;

                String originalName = file.getOriginalFilename();
                String ext = "";
                if (originalName != null && originalName.contains(".")) {
                    ext = originalName.substring(originalName.lastIndexOf("."));
                }

                String uniqueName = UUID.randomUUID().toString() + ext;
                Path filePath = Paths.get(uploadDir.getAbsolutePath(), uniqueName);

                Files.copy(file.getInputStream(), filePath);

                boolean isPdf = ext.equalsIgnoreCase(".pdf");
                String fileUrl = "http://localhost:5000/uploads/" + uniqueName;

                uploadedFiles.add(Map.of(
                        "url", fileUrl,
                        "fileName", originalName != null ? originalName : uniqueName,
                        "isPdf", isPdf,
                        "size", file.getSize()
                ));
            }

            return ResponseEntity.ok(Map.of("files", uploadedFiles));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Failed to upload file: " + e.getMessage()));
        }
    }
}
