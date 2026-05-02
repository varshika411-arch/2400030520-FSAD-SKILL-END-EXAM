package com.klef.fsad.exam.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klef.fsad.exam.model.Delivery;
import com.klef.fsad.exam.repository.DeliveryRepository;

@Service
public class DeliveryService 
{
    @Autowired
    private DeliveryRepository repo;

    public Delivery addDelivery(Delivery d) {
        return repo.save(d);
    }

    public Delivery updateDelivery(int id, Delivery d) {
        Delivery obj = repo.findById(id).orElse(null);

        if(obj != null) {
            obj.setName(d.getName());
            obj.setDate(d.getDate());
            obj.setStatus(d.getStatus());
            return repo.save(obj);
        }
        return null;
    }
}
