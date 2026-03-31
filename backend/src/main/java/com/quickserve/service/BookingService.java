package com.quickserve.service;

import com.quickserve.dto.BookingRequest;
import com.quickserve.dto.BookingResponse;
import com.quickserve.entity.Booking;
import com.quickserve.entity.BookingStatus;
import com.quickserve.entity.Provider;
import com.quickserve.entity.User;
import com.quickserve.repository.BookingRepository;
import com.quickserve.repository.ProviderRepository;
import com.quickserve.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProviderRepository providerRepository;

    public BookingResponse createBooking(BookingRequest request) {

        if (request.getCustomerId() == null) {
            throw new RuntimeException("Customer id is required");
        }

        if (request.getProviderId() == null) {
            throw new RuntimeException("Provider id is required");
        }

        if (request.getServiceDate() == null) {
            throw new RuntimeException("Service date is required");
        }

        if (request.getServiceTime() == null) {
            throw new RuntimeException("Service time is required");
        }

        if (request.getTotalAmount() == null || request.getTotalAmount() <= 0) {
            throw new RuntimeException("Total amount must be greater than 0");
        }

        User customer = userRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + request.getCustomerId()));

        Provider provider = providerRepository.findById(request.getProviderId())
                .orElseThrow(() -> new RuntimeException("Provider not found with id: " + request.getProviderId()));

        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setProvider(provider);
        booking.setBookingDate(LocalDate.now());
        booking.setServiceDate(request.getServiceDate());
        booking.setServiceTime(request.getServiceTime());
        booking.setStatus(request.getStatus() != null ? request.getStatus() : BookingStatus.PENDING);
        booking.setTotalAmount(request.getTotalAmount());
        booking.setServiceName(request.getServiceName());

        if (provider.getCategory() != null) {
            booking.setCategory(provider.getCategory());
        }

        Booking savedBooking = bookingRepository.save(booking);
        return mapToResponse(savedBooking);
    }

    public List<BookingResponse> getCustomerBookings(Long customerId) {
        return bookingRepository.findByCustomer_Id(customerId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getProviderBookings(Long providerId) {
        return bookingRepository.findByProvider_ProviderId(providerId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse updateBookingStatus(Long bookingId, BookingStatus status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + bookingId));

        booking.setStatus(status);
        Booking updatedBooking = bookingRepository.save(booking);

        return mapToResponse(updatedBooking);
    }

    public BookingResponse cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + bookingId));

        booking.setStatus(BookingStatus.CANCELLED);
        Booking updatedBooking = bookingRepository.save(booking);

        return mapToResponse(updatedBooking);
    }

    private BookingResponse mapToResponse(Booking booking) {
        BookingResponse response = new BookingResponse();

        response.setBookingId(booking.getBookingId());

        if (booking.getCustomer() != null) {
            response.setCustomerId(booking.getCustomer().getId());
            response.setCustomerName(booking.getCustomer().getName());
        }

        if (booking.getProvider() != null) {
            response.setProviderId(booking.getProvider().getProviderId());

            if (booking.getProvider().getUser() != null) {
                response.setProviderName(booking.getProvider().getUser().getName());
            }

            response.setServiceName(
                    booking.getServiceName() != null ? booking.getServiceName() : booking.getProvider().getServiceName()
            );
        }

        response.setBookingDate(booking.getBookingDate());
        response.setServiceDate(booking.getServiceDate());
        response.setServiceTime(booking.getServiceTime());
        response.setStatus(booking.getStatus().name());
        response.setTotalAmount(booking.getTotalAmount());

        return response;
    }
}