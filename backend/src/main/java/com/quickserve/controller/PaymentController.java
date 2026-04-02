package com.quickserve.controller;

import com.quickserve.dto.CreateOrderRequest;
import com.quickserve.dto.VerifyPaymentRequest;
import com.quickserve.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/{bookingId}/create-order")
    public ResponseEntity<?> createOrder(@PathVariable Long bookingId,
                                         @RequestBody CreateOrderRequest request) {
        try {
            return ResponseEntity.ok(paymentService.createOrderForBooking(bookingId, request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{bookingId}/verify-payment")
    public ResponseEntity<?> verifyPayment(@PathVariable Long bookingId,
                                           @RequestBody VerifyPaymentRequest request) {
        try {
            return ResponseEntity.ok(paymentService.verifyPaymentAndUpdateBooking(bookingId, request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}