package com.kartik.Train.controller;

import com.kartik.Train.entity.Train;
import com.kartik.Train.service.TrainService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trains")
public class TrainController {

    private TrainService trainService;
   public TrainController(TrainService trainService){
        this.trainService = trainService;
    }

    @GetMapping
    public List<Train> getAllTrains(){
        return  trainService.getAllTrains();
    }

    @PostMapping
    public Train train(@RequestBody Train train){
        return trainService.addTrain(train);
    }
}
