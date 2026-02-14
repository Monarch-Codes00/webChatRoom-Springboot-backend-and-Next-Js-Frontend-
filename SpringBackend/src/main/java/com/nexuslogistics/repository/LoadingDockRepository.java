package com.nexuslogistics.repository;

import com.nexuslogistics.model.LoadingDock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoadingDockRepository extends JpaRepository<LoadingDock, Long> {
}
