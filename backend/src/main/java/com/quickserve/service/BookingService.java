package com.quickserve.service;

import com.quickserve.dto.BookingRequest;
import com.quickserve.dto.BookingResponse;
import com.quickserve.entity.Booking;
import com.quickserve.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public BookingResponse createBooking(BookingRequest request) {
        Booking booking = new Booking();
        booking.setCustomerName(request.getCustomerName());
        booking.setServiceName(request.getServiceName());
        booking.setAmount(request.getAmount());
        booking.setBookingDate(request.getBookingDate());
        booking.setBookingTime(request.getBookingTime());
        booking.setAddress(request.getAddress());
        booking.setStatus("PENDING");

        Booking savedBooking = bookingRepository.save(booking);
        return mapToResponse(savedBooking);
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse getBookingById(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        return mapToResponse(booking);
    }

    private BookingResponse mapToResponse(Booking booking) {
        BookingResponse response = new BookingResponse();
        response.setBookingId(booking.getBookingId());
        response.setCustomerName(booking.getCustomerName());
        response.setServiceName(booking.getServiceName());
        response.setAmount(booking.getAmount());
        response.setBookingDate(booking.getBookingDate());
        response.setBookingTime(booking.getBookingTime());
        response.setAddress(booking.getAddress());
        response.setStatus(booking.getStatus());
        response.setRazorpayOrderId(booking.getRazorpayOrderId());
        response.setRazorpayPaymentId(booking.getRazorpayPaymentId());
        return response;
    }
}