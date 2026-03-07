package com.quickserve.controller;

import com.quickserve.entity.Provider;
import com.quickserve.service.ProviderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/provider")
@CrossOrigin(origins = "*")
public class ProviderController {

    @Autowired
    private ProviderService providerService;

    @PostMapping("/add")
    public ResponseEntity<?> addProvider(@RequestBody Provider provider) {
        try {
            Provider savedProvider = providerService.addProvider(provider);
            return new ResponseEntity<>(savedProvider, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/byCategory/{categoryId}")
    public ResponseEntity<List<Provider>> getProvidersByCategory(@PathVariable Long categoryId) {
        return new ResponseEntity<>(providerService.getProvidersByCategory(categoryId), HttpStatus.OK);
    }

    @GetMapping("/byLocation/{location}")
    public ResponseEntity<List<Provider>> getProvidersByLocation(@PathVariable String location) {
        return new ResponseEntity<>(providerService.getProvidersByLocation(location), HttpStatus.OK);
    }
}
