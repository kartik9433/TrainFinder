package com.kartik.Train.controller;

import com.kartik.Train.entity.Station;
import com.kartik.Train.entity.Train;
import com.kartik.Train.entity.TrainSchedule;
import com.kartik.Train.repo.StationRepository;
import com.kartik.Train.repo.TrainRepository;
import com.kartik.Train.repo.TrainScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/test")
public class Test {
    @Autowired
    StationRepository stationRepository;

    @Autowired
    TrainRepository trainRepository;

    @Autowired
    TrainScheduleRepository trainScheduleRepository;

    @GetMapping
    public  void test(){
        Station delhi = new Station(null,"Delhi","NDLS");
        Station pune = new Station(null,"pune city","PNNN");
        Station goa = new Station(null,"goa centre","GOO");
        Station ghaziabad = new Station(null,"ghaziabad centre","GHZA");
        Station bijnor = new Station(null,"bijnor","BNOR");

        stationRepository.saveAll(List.of(delhi,pune,goa,ghaziabad,bijnor));

        Train rajdjani = new Train(null,"Rajdhani Expres","12890",null);
        Train durunto = new Train(null,"Durunto Expres","12891",null);
        Train shatabdi = new Train(null,"Shatabdi Expres","12892",null);

        trainRepository.saveAll(List.of(rajdjani,durunto,shatabdi));

        TrainSchedule sc1 = new TrainSchedule(null,rajdjani,delhi,pune,"06:00","14:00");
        TrainSchedule sc2 = new TrainSchedule(null,durunto,goa,pune,"08:00","14:00");
        TrainSchedule sc3 = new TrainSchedule(null,shatabdi,ghaziabad,bijnor,"09:00","14:00");

        trainScheduleRepository.saveAll(List.of(sc1,sc2,sc3));
        System.out.println("data is successfully inserted");
    }
}
