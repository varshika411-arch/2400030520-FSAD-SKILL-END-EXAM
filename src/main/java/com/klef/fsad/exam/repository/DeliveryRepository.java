package com.klef.fsad.exam.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.klef.fsad.exam.model.Delivery;

public interface DeliveryRepository extends JpaRepository<Delivery, Integer>
{
}
