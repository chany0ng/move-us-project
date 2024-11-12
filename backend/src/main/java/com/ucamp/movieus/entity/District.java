package com.ucamp.movieus.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@Table(name = "district")
public class District {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int districtId;

    @Column(nullable = false)
    private String districtName;

    @Column(nullable = false)
    private String groupName;

    @OneToMany(mappedBy = "district")
    private List<Theater> theaters;
}

