package com.quickserve.controller;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.json.JSONObject;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Value("${razorpay.key.id:rzp_test_your_dummy_key_here}")
    private String razorpayId;

    @Value("${razorpay.key.secret:your_dummy_secret_here}")
    private String razorpaySecret;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> data) {
        try {
            int amount = Integer.parseInt(data.get("amount").toString());
            String currency = data.getOrDefault("currency", "INR").toString();
            String receipt = data.getOrDefault("receipt", "txn_" + System.currentTimeMillis()).toString();

            RazorpayClient razorpay = new RazorpayClient(razorpayId, razorpaySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amount);
            orderRequest.put("currency", currency);
            orderRequest.put("receipt", receipt);

            Order order = razorpay.orders.create(orderRequest);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("orderId", order.get("id"));
            response.put("amount", order.get("amount"));
            response.put("currency", order.get("currency"));
            response.put("key", razorpayId);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error creating Razorpay order: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> data) {
        try {
            String razorpayOrderId = data.get("razorpayOrderId");
            String razorpayPaymentId = data.get("razorpayPaymentId");
            String razorpaySignature = data.get("razorpaySignature");

            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", razorpayOrderId);
            options.put("razorpay_payment_id", razorpayPaymentId);
            options.put("razorpay_signature", razorpaySignature);

            boolean status = Utils.verifyPaymentSignature(options, razorpaySecret);

            Map<String, Object> response = new HashMap<>();
            if (status) {
                response.put("success", true);
                response.put("message", "Payment Successful");
            } else {
                response.put("success", false);
                response.put("message", "Payment Verification Failed");
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error verifying payment: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
