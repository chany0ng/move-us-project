package com.ucamp.movieus.controller;

import com.ucamp.movieus.entity.District;
import com.ucamp.movieus.entity.Theater;
import com.ucamp.movieus.repository.DistrictRepository;
import com.ucamp.movieus.repository.TheaterRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/cinemas")
public class CinemaController {

    private final DistrictRepository districtRepository;
    private final TheaterRepository theaterRepository;

    public CinemaController(DistrictRepository districtRepository, TheaterRepository theaterRepository) {
        this.districtRepository = districtRepository;
        this.theaterRepository = theaterRepository;
    }

    @GetMapping("/locations")
    public ResponseEntity<Map<String, Map<String, List<String>>>> getCinemaLocations() {
        Map<String, Map<String, List<String>>> cinemaData = new HashMap<>();

        // 모든 구역(groupName)을 가져와 그룹화
        List<District> districts = districtRepository.findAll();

        // 각 구역 그룹에 대해 체인과 지점을 구성
        for (District district : districts) {
            String groupName = district.getGroupName();
            Map<String, List<String>> companyMap = cinemaData.computeIfAbsent(groupName, k -> new HashMap<>());

            // 각 그룹의 영화관들을 조회하고 체인별로 영화관을 분류
            List<Theater> theaters = theaterRepository.findByDistrict(district);

            for (Theater theater : theaters) {
                String companyName = theater.getCinemaCompany().getCompanyName();
                String theaterName = theater.getTheaterName();

                // 체인별로 영화관 지점 추가
                companyMap.computeIfAbsent(companyName, k -> new ArrayList<>()).add(theaterName);
            }
        }

        return ResponseEntity.ok(cinemaData);
    }
}
