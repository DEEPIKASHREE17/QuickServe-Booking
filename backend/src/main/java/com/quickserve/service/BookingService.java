package com.quickserve.service;

import com.quickserve.entity.Booking;
import com.quickserve.entity.BookingStatus;
import com.quickserve.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    public Booking createBooking(Booking booking) {
        booking.setStatus(BookingStatus.PENDING);
        if (booking.getTotalAmount() == null && booking.getHourlyRate() != null && booking.getDurationHours() != null) {
            booking.setTotalAmount(booking.getHourlyRate() * booking.getDurationHours());
        }
        return bookingRepository.save(booking);
    }

    public List<Booking> getBookingsByCustomer(Long customerId) {
        return bookingRepository.findByCustomer_Id(customerId);
    }

    public List<Booking> getBookingsByProvider(Long providerId) {
        return bookingRepository.findByProvider_ProviderId(providerId);
    }

    public Booking updateStatus(Long bookingId, BookingStatus status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(status);
        return bookingRepository.save(booking);
    }
}
