package com.quickserve.controller;

import com.quickserve.entity.Booking;
import com.quickserve.entity.BookingStatus;
import com.quickserve.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/create")
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        try {
            return ResponseEntity.ok(bookingService.createBooking(booking));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/customer/{id}")
    public ResponseEntity<?> getCustomerBookings(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingsByCustomer(id));
    }

    @GetMapping("/provider/{id}")
    public ResponseEntity<?> getProviderBookings(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingsByProvider(id));
    }

    @PutMapping("/update-status/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam BookingStatus status) {
        try {
            return ResponseEntity.ok(bookingService.updateStatus(id, status));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
