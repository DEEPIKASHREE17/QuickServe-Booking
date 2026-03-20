package com.quickserve.service;

import com.quickserve.dto.ProviderServiceResponse;
import com.quickserve.entity.Provider;
import com.quickserve.repository.ProviderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProviderService {

    @Autowired
    private ProviderRepository providerRepository;

    public List<ProviderServiceResponse> getAllProviders() {
        List<Provider> providers = providerRepository.findAll();
        return mapProvidersToResponse(providers);
    }

    public ProviderServiceResponse getProviderById(Long providerId) {
        Provider provider = providerRepository.findById(providerId)
                .orElseThrow(() -> new RuntimeException("Provider not found with id: " + providerId));

        return mapToResponse(provider);
    }

    public List<ProviderServiceResponse> getProvidersByLocation(String location) {
        List<Provider> providers = providerRepository.findByLocationIgnoreCase(location);
        return mapProvidersToResponse(providers);
    }

    public List<ProviderServiceResponse> getProvidersByCategory(Long categoryId) {
        List<Provider> providers = providerRepository.findByCategory_CategoryId(categoryId);
        return mapProvidersToResponse(providers);
    }

    public List<ProviderServiceResponse> searchProviders(String location, Long categoryId) {
        List<Provider> providers = providerRepository.findByLocationIgnoreCaseAndCategory_CategoryId(location, categoryId);
        return mapProvidersToResponse(providers);
    }

    public List<ProviderServiceResponse> searchProvidersWithPrice(String location, Long categoryId, Double maxPrice) {
        List<Provider> providers = providerRepository
                .findByLocationIgnoreCaseAndCategory_CategoryIdAndPriceLessThanEqual(location, categoryId, maxPrice);

        return mapProvidersToResponse(providers);
    }

    private List<ProviderServiceResponse> mapProvidersToResponse(List<Provider> providers) {
        List<ProviderServiceResponse> responses = new ArrayList<>();

        for (Provider provider : providers) {
            responses.add(mapToResponse(provider));
        }

        return responses;
    }

    private ProviderServiceResponse mapToResponse(Provider provider) {
        ProviderServiceResponse response = new ProviderServiceResponse();

        response.setProviderId(provider.getProviderId());
        response.setProviderName(provider.getUser() != null ? provider.getUser().getName() : null);
        response.setEmail(provider.getUser() != null ? provider.getUser().getEmail() : null);
        response.setPhone(provider.getUser() != null ? provider.getUser().getPhone() : null);
        response.setCategoryName(provider.getCategory() != null ? provider.getCategory().getCategoryName() : null);
        response.setServiceName(provider.getServiceName());
        response.setLocation(provider.getLocation());
        response.setPrice(provider.getPrice());
        response.setAvailability(provider.getAvailability());
        response.setExperience(provider.getExperience());
        response.setRating(provider.getRating());

        return response;
    }
}