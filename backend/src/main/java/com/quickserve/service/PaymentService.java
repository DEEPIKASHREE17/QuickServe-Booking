package com.quickserve.service;

import com.quickserve.dto.CreateOrderRequest;
import com.quickserve.dto.VerifyPaymentRequest;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentService {

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    public Map<String, Object> createOrderForBooking(Long bookingId, CreateOrderRequest request) throws Exception {
        RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", request.getAmount());
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "booking_" + bookingId);

        Order order = razorpayClient.orders.create(orderRequest);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("orderId", order.get("id"));
        response.put("amount", order.get("amount"));
        response.put("currency", order.get("currency"));
        response.put("key", razorpayKeyId);

        return response;
    }

    public Map<String, Object> verifyPaymentAndUpdateBooking(Long bookingId, VerifyPaymentRequest request) throws Exception {
        String data = request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId();

        boolean valid = Utils.verifySignature(data, request.getRazorpaySignature(), razorpayKeySecret);

        Map<String, Object> response = new HashMap<>();

        if (valid) {
            response.put("success", true);
            response.put("message", "Payment verified successfully");
        } else {
            response.put("success", false);
            response.put("message", "Payment verification failed");
        }

        return response;
    }
}