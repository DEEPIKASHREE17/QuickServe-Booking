package com.quickserve.repository;

import com.quickserve.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomer_Id(Long customerId);

    List<Booking> findByProvider_ProviderId(Long providerId);
}
