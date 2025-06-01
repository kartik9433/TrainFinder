package com.kartik.Train.repo;

import com.kartik.Train.entity.Train;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrainRepository extends JpaRepository<Train,Long> {

}
