package com.kartik.Train.controller;

import com.kartik.Train.entity.TrainSchedule;
import com.kartik.Train.service.TrainSearchService;
import jakarta.persistence.Entity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/search")
@CrossOrigin
public class TrainSearchController {
     private TrainSearchService trainSearchService;

     public TrainSearchController(TrainSearchService trainSearchService){
            this.trainSearchService = trainSearchService;
     }

     @GetMapping("/by-code")
     public List<TrainSchedule> findTrainByStationCode(@RequestParam String sourceCode
             ,@RequestParam String destinationCode){
         return trainSearchService.findTrainByStationCode(sourceCode.toUpperCase(),destinationCode.toUpperCase());
     }
     @GetMapping("/by-name")
    public List<TrainSchedule> findTrainByStationName(@RequestParam String sourceName
            ,@RequestParam String destinationName){
        return trainSearchService.findTrainByStationName(sourceName.toUpperCase(),
                destinationName.toUpperCase());
    }
}
