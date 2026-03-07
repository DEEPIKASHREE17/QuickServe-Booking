package com.quickserve.service;

import com.quickserve.entity.Provider;
import com.quickserve.repository.ProviderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProviderService {

    @Autowired
    private ProviderRepository providerRepository;

    public Provider addProvider(Provider provider) {
        return providerRepository.save(provider);
    }

    public List<Provider> getProvidersByCategory(Long categoryId) {
        return providerRepository.findByCategoryCategoryId(categoryId);
    }

    public List<Provider> getProvidersByLocation(String location) {
        return providerRepository.findByUserLocationIgnoreCase(location);
    }
}
