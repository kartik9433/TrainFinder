package com.kartik.Train.service;

import com.kartik.Train.entity.TrainSchedule;
import com.kartik.Train.repo.TrainScheduleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainSearchService {
    private  TrainScheduleRepository trainScheduleRepository;
    public TrainSearchService(TrainScheduleRepository trainScheduleRepository){
              this.trainScheduleRepository = trainScheduleRepository;
    }

    public List<TrainSchedule> findTrainByStationCode(String sourceCode,
                                                      String destinationCode) {
     return trainScheduleRepository.findBySource_StationCodeAndDestination_StationCode(sourceCode,destinationCode);
    }

    public List<TrainSchedule> findTrainByStationName(String sourceName,
                                                      String destinationName) {
        return trainScheduleRepository.findBySource_StationNameAndDestination_StationName(sourceName,destinationName);

    }
}
