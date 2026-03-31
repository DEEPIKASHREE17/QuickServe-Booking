package com.quickserve.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    @GetMapping("/key")
    public ResponseEntity<?> getKeyStatus() {
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Payment API is working"
        ));
    }
}