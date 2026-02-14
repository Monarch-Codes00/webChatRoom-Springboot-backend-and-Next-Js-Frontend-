package com.nexuslogistics.repository;

import com.nexuslogistics.model.DriverScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DriverScoreRepository extends JpaRepository<DriverScore, Long> {
    List<DriverScore> findAllByOrderByEcoScoreDesc();
}
