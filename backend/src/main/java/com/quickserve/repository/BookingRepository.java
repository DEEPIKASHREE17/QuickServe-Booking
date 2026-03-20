package com.quickserve.repository;

import com.quickserve.entity.Booking;
import com.quickserve.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByCustomer_Id(Long customerId);

    List<Booking> findByProvider_ProviderId(Long providerId);

    List<Booking> findByStatus(BookingStatus status);
}