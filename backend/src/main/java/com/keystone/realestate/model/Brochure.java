package com.keystone.realestate.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "brochures")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Brochure {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    @JsonIgnore
    private Project project;

    private String fileName;

    @Column(nullable = false, length = 1000)
    private String fileUrl;
}
