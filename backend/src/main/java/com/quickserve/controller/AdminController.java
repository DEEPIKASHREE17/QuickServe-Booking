package com.quickserve.controller;

import com.quickserve.entity.Booking;
import com.quickserve.entity.User;
import com.quickserve.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> bookings = adminService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        String response = adminService.deleteUser(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/block-provider/{id}")
    public ResponseEntity<String> blockProvider(@PathVariable Long id) {
        String response = adminService.blockProvider(id);
        return ResponseEntity.ok(response);
    }
}