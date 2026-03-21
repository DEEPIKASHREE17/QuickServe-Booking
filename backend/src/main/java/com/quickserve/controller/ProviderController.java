package com.quickserve.controller;

import com.quickserve.dto.ProviderServiceResponse;
import com.quickserve.service.ProviderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/providers")
@CrossOrigin(origins = "*")
public class ProviderController {

    @Autowired
    private ProviderService providerService;

    @GetMapping("/all")
    public ResponseEntity<List<ProviderServiceResponse>> getAllProviders() {
        return ResponseEntity.ok(providerService.getAllProviders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProviderServiceResponse> getProviderById(@PathVariable Long id) {
        return ResponseEntity.ok(providerService.getProviderById(id));
    }

    @GetMapping("/location/{location}")
    public ResponseEntity<List<ProviderServiceResponse>> getProvidersByLocation(@PathVariable String location) {
        return ResponseEntity.ok(providerService.getProvidersByLocation(location));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ProviderServiceResponse>> getProvidersByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(providerService.getProvidersByCategory(categoryId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProviderServiceResponse>> searchProviders(
            @RequestParam String location,
            @RequestParam Long category
    ) {
        return ResponseEntity.ok(providerService.searchProviders(location, category));
    }

    @GetMapping("/search/filter")
    public ResponseEntity<List<ProviderServiceResponse>> searchProvidersWithPrice(
            @RequestParam String location,
            @RequestParam Long category,
            @RequestParam Double maxPrice
    ) {
        return ResponseEntity.ok(providerService.searchProvidersWithPrice(location, category, maxPrice));
    }
}