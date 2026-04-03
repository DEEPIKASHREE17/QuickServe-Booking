package com.quickserve.service;

import com.quickserve.entity.Booking;
import com.quickserve.entity.User;
import com.quickserve.repository.BookingRepository;
import com.quickserve.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public String deleteUser(Long userId) {
        Optional<User> optionalUser = userRepository.findById(userId);

        if (optionalUser.isEmpty()) {
            return "User not found";
        }

        userRepository.deleteById(userId);
        return "User deleted successfully";
    }

    public String blockProvider(Long userId) {
        Optional<User> optionalUser = userRepository.findById(userId);

        if (optionalUser.isEmpty()) {
            return "User not found";
        }

        User user = optionalUser.get();

        if (!"PROVIDER".equalsIgnoreCase(user.getRole())) {
            return "Only provider can be blocked";
        }

        user.setBlocked(true);
        userRepository.save(user);

        return "Provider blocked successfully";
    }
}