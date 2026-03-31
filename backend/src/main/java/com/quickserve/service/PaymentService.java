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

    public Map<String, Object> createOrder(CreateOrderRequest request) throws Exception {
        if (request.getAmount() == null || request.getAmount() <= 0) {
            throw new RuntimeException("Amount must be greater than 0");
        }

        String currency = (request.getCurrency() == null || request.getCurrency().isBlank())
                ? "INR"
                : request.getCurrency();

        String receipt = (request.getReceipt() == null || request.getReceipt().isBlank())
                ? "receipt_" + System.currentTimeMillis()
                : request.getReceipt();

        RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", request.getAmount()); // amount in paise
        orderRequest.put("currency", currency);
        orderRequest.put("receipt", receipt);
        orderRequest.put("payment_capture", 1);

        Order order = razorpayClient.orders.create(orderRequest);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("orderId", order.get("id"));
        response.put("amount", order.get("amount"));
        response.put("currency", order.get("currency"));
        response.put("receipt", order.get("receipt"));
        response.put("key", razorpayKeyId);

        return response;
    }

    public Map<String, Object> verifyPayment(VerifyPaymentRequest request) throws Exception {
        if (request.getRazorpayOrderId() == null || request.getRazorpayPaymentId() == null || request.getRazorpaySignature() == null) {
            throw new RuntimeException("Missing payment verification fields");
        }

        JSONObject options = new JSONObject();
        options.put("razorpay_order_id", request.getRazorpayOrderId());
        options.put("razorpay_payment_id", request.getRazorpayPaymentId());
        options.put("razorpay_signature", request.getRazorpaySignature());

        boolean isValid = Utils.verifyPaymentSignature(options, razorpayKeySecret);

        Map<String, Object> response = new HashMap<>();
        response.put("success", isValid);
        response.put("message", isValid ? "Payment verified successfully" : "Invalid payment signature");
        response.put("paymentId", request.getRazorpayPaymentId());
        response.put("orderId", request.getRazorpayOrderId());

        return response;
    }
}