package com.quickserve.controller;

import com.quickserve.dto.BookingRequest;
import com.quickserve.dto.BookingResponse;
import com.quickserve.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/create")
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {
        return ResponseEntity.ok(bookingService.createBooking(request));
    }

    @GetMapping("/customer/{id}")
    public ResponseEntity<List<BookingResponse>> getCustomerBookings(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getCustomerBookings(id));
    }

    @GetMapping("/provider/{id}")
    public ResponseEntity<List<BookingResponse>> getProviderBookings(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getProviderBookings(id));
    }

    @PutMapping("/status/{bookingId}")
    public ResponseEntity<BookingResponse> updateBookingStatus(
            @PathVariable Long bookingId,
            @RequestBody BookingRequest request) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(bookingId, request.getStatus()));
    }

    @PutMapping("/cancel/{bookingId}")
    public ResponseEntity<BookingResponse> cancelBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingService.cancelBooking(bookingId));
    }
}