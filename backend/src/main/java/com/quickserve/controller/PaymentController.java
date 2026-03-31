package com.quickserve.controller;

import com.quickserve.dto.CreateOrderRequest;
import com.quickserve.dto.VerifyPaymentRequest;
import com.quickserve.service.PaymentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest request) {
        try {
            Map<String, Object> response = paymentService.createOrder(request);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody VerifyPaymentRequest request) {
        try {
            Map<String, Object> response = paymentService.verifyPayment(request);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/key")
    public ResponseEntity<?> getKey() {
        return ResponseEntity.ok(Map.of("success", true, "message", "Payment API working"));
    }
}