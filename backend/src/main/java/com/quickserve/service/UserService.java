package com.quickserve.service;

import com.quickserve.dto.LoginRequest;
import com.quickserve.dto.RegisterRequest;
import com.quickserve.entity.User;
import com.quickserve.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String register(RegisterRequest request) {
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());

        if (existingUser.isPresent()) {
            return "Email already exists";
        }

        // Secret key validation for ADMIN role
        if ("ADMIN".equalsIgnoreCase(request.getRole())) {
            String secretKey = "QUICKSERVE_ADMIN_2026";
            if (request.getAdminKey() == null || !request.getAdminKey().equals(secretKey)) {
                return "Invalid Admin Passcode";
            }
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        } else {
            user.setPhone("");
        }

        if (request.getLocation() != null) {
            user.setLocation(request.getLocation());
        } else {
            user.setLocation("");
        }

        user.setBlocked(false);

        userRepository.save(user);
        return "User registered successfully";
    }

    public String login(LoginRequest request) {
        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());

        if (optionalUser.isEmpty()) {
            return "User not found";
        }

        User user = optionalUser.get();

        if (user.isBlocked()) {
            return "Your account is blocked by admin";
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return "Invalid password";
        }

        return "Login successful";
    }

    public User getProfile(Long userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        return optionalUser.orElse(null);
    }

    public String updateProfile(Long userId, User updatedUser) {
        Optional<User> optionalUser = userRepository.findById(userId);

        if (optionalUser.isEmpty()) {
            return "User not found";
        }

        User existingUser = optionalUser.get();

        if (updatedUser.getName() != null && !updatedUser.getName().isEmpty()) {
            existingUser.setName(updatedUser.getName());
        }

        if (updatedUser.getEmail() != null && !updatedUser.getEmail().isEmpty()) {
            existingUser.setEmail(updatedUser.getEmail());
        }

        if (updatedUser.getPhone() != null) {
            existingUser.setPhone(updatedUser.getPhone());
        }

        if (updatedUser.getLocation() != null) {
            existingUser.setLocation(updatedUser.getLocation());
        }

        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }

        userRepository.save(existingUser);
        return "Profile updated successfully";
    }
}