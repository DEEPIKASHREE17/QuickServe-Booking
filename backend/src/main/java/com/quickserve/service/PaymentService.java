package com.quickserve.service;

import com.quickserve.dto.CreateOrderRequest;
import com.quickserve.dto.VerifyPaymentRequest;
import com.quickserve.entity.Booking;
import com.quickserve.repository.BookingRepository;
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

    private final BookingRepository bookingRepository;

    public PaymentService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public Map<String, Object> createOrderForBooking(Long bookingId, CreateOrderRequest request) throws Exception {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (request.getAmount() == null || request.getAmount() <= 0) {
            throw new RuntimeException("Amount must be greater than 0");
        }

        RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", request.getAmount());
        orderRequest.put("currency", request.getCurrency() == null || request.getCurrency().isBlank() ? "INR" : request.getCurrency());
        orderRequest.put("receipt", request.getReceipt() == null || request.getReceipt().isBlank() ? "receipt_" + bookingId : request.getReceipt());
        orderRequest.put("payment_capture", 1);

        Order order = razorpayClient.orders.create(orderRequest);

        booking.setRazorpayOrderId(order.get("id"));
        booking.setStatus("PENDING");
        bookingRepository.save(booking);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("key", razorpayKeyId);
        response.put("orderId", order.get("id"));
        response.put("amount", order.get("amount"));
        response.put("currency", order.get("currency"));
        response.put("bookingId", booking.getBookingId());
        response.put("status", booking.getStatus());

        return response;
    }

    public Map<String, Object> verifyPaymentAndUpdateBooking(Long bookingId, VerifyPaymentRequest request) throws Exception {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        JSONObject options = new JSONObject();
        options.put("razorpay_order_id", request.getRazorpayOrderId());
        options.put("razorpay_payment_id", request.getRazorpayPaymentId());
        options.put("razorpay_signature", request.getRazorpaySignature());

        boolean isValid = Utils.verifyPaymentSignature(options, razorpayKeySecret);

        if (isValid) {
            booking.setRazorpayOrderId(request.getRazorpayOrderId());
            booking.setRazorpayPaymentId(request.getRazorpayPaymentId());
            booking.setRazorpaySignature(request.getRazorpaySignature());
            booking.setStatus("CONFIRMED");
        } else {
            booking.setStatus("FAILED");
        }

        bookingRepository.save(booking);

        Map<String, Object> response = new HashMap<>();
        response.put("success", isValid);
        response.put("bookingId", booking.getBookingId());
        response.put("status", booking.getStatus());
        response.put("message", isValid ? "Payment verified and booking confirmed" : "Payment verification failed");

        return response;
    }
}