package com.quickserve.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/health")
    public String health() {
        return "Backend is running successfully!";
    }

    @GetMapping("/home")
    public String home() {
        return "Welcome to QuickServe Backend!";
    }
}