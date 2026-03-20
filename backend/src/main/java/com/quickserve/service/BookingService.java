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
import java.util.ArrayList;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProviderRepository providerRepository;

    public BookingResponse createBooking(BookingRequest request) {
        User customer = userRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + request.getCustomerId()));

        Provider provider = providerRepository.findById(request.getProviderId())
                .orElseThrow(() -> new RuntimeException("Provider not found with id: " + request.getProviderId()));

        if (request.getServiceDate() == null) {
            throw new RuntimeException("Service date is required");
        }

        if (request.getServiceTime() == null) {
            throw new RuntimeException("Service time is required");
        }

        if (request.getServiceDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Service date cannot be in the past");
        }

        if (request.getTotalAmount() == null || request.getTotalAmount() <= 0) {
            throw new RuntimeException("Total amount must be greater than 0");
        }

        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setProvider(provider);

        // important: set category from provider
        booking.setCategory(provider.getCategory());

        // if your Booking entity has providerService field, uncomment after checking entity
        // booking.setProviderService(...)

        booking.setBookingDate(LocalDate.now());
        booking.setServiceDate(request.getServiceDate());
        booking.setServiceTime(request.getServiceTime());
        booking.setStatus(BookingStatus.PENDING);
        booking.setTotalAmount(request.getTotalAmount());
        booking.setAddress(request.getAddress());
        booking.setNotes(request.getNotes());

        Booking savedBooking = bookingRepository.save(booking);

        return mapToResponse(savedBooking);
    }

    public List<BookingResponse> getBookingsByCustomer(Long customerId) {
        List<Booking> bookings = bookingRepository.findByCustomer_Id(customerId);
        return mapBookingsToResponse(bookings);
    }

    public List<BookingResponse> getBookingsByProvider(Long providerId) {
        List<Booking> bookings = bookingRepository.findByProvider_ProviderId(providerId);
        return mapBookingsToResponse(bookings);
    }

    public BookingResponse getBookingById(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + bookingId));

        return mapToResponse(booking);
    }

    public BookingResponse updateBookingStatus(Long bookingId, String status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + bookingId));

        BookingStatus bookingStatus;
        try {
            bookingStatus = BookingStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid booking status: " + status);
        }

        booking.setStatus(bookingStatus);
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

    private List<BookingResponse> mapBookingsToResponse(List<Booking> bookings) {
        List<BookingResponse> responses = new ArrayList<>();

        for (Booking booking : bookings) {
            responses.add(mapToResponse(booking));
        }

        return responses;
    }

    private BookingResponse mapToResponse(Booking booking) {
        BookingResponse response = new BookingResponse();

        response.setBookingId(booking.getBookingId());
        response.setCustomerId(booking.getCustomer() != null ? booking.getCustomer().getId() : null);
        response.setCustomerName(booking.getCustomer() != null ? booking.getCustomer().getName() : null);
        response.setProviderId(booking.getProvider() != null ? booking.getProvider().getProviderId() : null);
        response.setProviderName(
                booking.getProvider() != null && booking.getProvider().getUser() != null
                        ? booking.getProvider().getUser().getName()
                        : null
        );
        response.setServiceName(booking.getProvider() != null ? booking.getProvider().getServiceName() : null);
        response.setBookingDate(booking.getBookingDate());
        response.setServiceDate(booking.getServiceDate());
        response.setServiceTime(booking.getServiceTime());
        response.setStatus(booking.getStatus() != null ? booking.getStatus().name() : null);
        response.setTotalAmount(booking.getTotalAmount());
        response.setAddress(booking.getAddress());
        response.setNotes(booking.getNotes());

        return response;
    }
}