package com.nexuslogistics.controller;

import com.nexuslogistics.model.DriverScore;
import com.nexuslogistics.repository.DriverScoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
@CrossOrigin(origins = "*")
public class LeaderboardController {

    @Autowired
    private DriverScoreRepository driverScoreRepository;

    @GetMapping
    public List<DriverScore> getEcoLeaderboard() {
        return driverScoreRepository.findAllByOrderByEcoScoreDesc();
    }
}
