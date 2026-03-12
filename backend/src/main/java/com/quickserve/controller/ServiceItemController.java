package com.quickserve.controller;

import com.quickserve.service.ServiceItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*")
public class ServiceItemController {

    @Autowired
    private ServiceItemService serviceItemService;

    @GetMapping("/byCategory/{categoryId}")
    public ResponseEntity<?> getServicesByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(serviceItemService.getByCategory(categoryId));
    }
}
