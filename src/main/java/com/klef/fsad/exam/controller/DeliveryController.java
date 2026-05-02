package com.klef.fsad.exam.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.klef.fsad.exam.model.Delivery;
import com.klef.fsad.exam.service.DeliveryService;

@RestController
@RequestMapping("/delivery")
public class DeliveryController 
{
    @Autowired
    private DeliveryService service;

    @PostMapping("/add")
    public Delivery addDelivery(@RequestBody Delivery d) {
        return service.addDelivery(d);
    }

    @PutMapping("/update/{id}")
    public Delivery updateDelivery(@PathVariable int id, @RequestBody Delivery d) {
        return service.updateDelivery(id, d);
    }
}
