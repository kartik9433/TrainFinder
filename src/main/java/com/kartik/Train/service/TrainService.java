package com.kartik.Train.service;

import com.kartik.Train.entity.Train;
import com.kartik.Train.repo.TrainRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainService {

      private final TrainRepository trainRepository;

      public TrainService(TrainRepository trainRepository){
           this.trainRepository =trainRepository;
      }

    public List<Train> getAllTrains() {
          return  trainRepository.findAll();
    }

    public Train addTrain(Train train) {
       return trainRepository.save(train);
    }
}
