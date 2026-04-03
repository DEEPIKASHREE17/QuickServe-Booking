package com.quickserve.controller;

import com.quickserve.dto.BookingRequest;
import com.quickserve.dto.BookingResponse;
import com.quickserve.dto.CreateOrderRequest;
import com.quickserve.dto.VerifyPaymentRequest;
import com.quickserve.service.BookingService;
import com.quickserve.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private final BookingService bookingService;
    private final PaymentService paymentService;

    public BookingController(BookingService bookingService, PaymentService paymentService) {
        this.bookingService = bookingService;
        this.paymentService = paymentService;
    }

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@RequestBody BookingRequest request) {
        return ResponseEntity.ok(bookingService.createBooking(request));
    }

    @GetMapping
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingService.getBookingById(bookingId));
    }

    @PostMapping("/{bookingId}/create-order")
    public ResponseEntity<?> createOrderForBooking(@PathVariable Long bookingId,
                                                   @RequestBody CreateOrderRequest request) {
        try {
            Map<String, Object> response = paymentService.createOrderForBooking(bookingId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/{bookingId}/verify-payment")
    public ResponseEntity<?> verifyPayment(@PathVariable Long bookingId,
                                           @RequestBody VerifyPaymentRequest request) {
        try {
            Map<String, Object> response = paymentService.verifyPaymentAndUpdateBooking(bookingId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }
}