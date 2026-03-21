package com.quickserve.service;

import com.quickserve.dto.ReviewRequest;
import com.quickserve.entity.Review;
import com.quickserve.repository.ProviderRepository;
import com.quickserve.repository.ReviewRepository;
import com.quickserve.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProviderRepository providerRepository;

    public Review addReview(ReviewRequest request) {

        if (request.getCustomerId() == null) {
            throw new RuntimeException("Customer id is required");
        }

        if (request.getProviderId() == null) {
            throw new RuntimeException("Provider id is required");
        }

        if (!userRepository.existsById(request.getCustomerId())) {
            throw new RuntimeException("Customer not found with id: " + request.getCustomerId());
        }

        if (!providerRepository.existsById(request.getProviderId())) {
            throw new RuntimeException("Provider not found with id: " + request.getProviderId());
        }

        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        Review review = new Review();
        review.setCustomerId(request.getCustomerId());
        review.setProviderId(request.getProviderId());
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        return reviewRepository.save(review);
    }

    public List<Review> getReviewsByProvider(Long providerId) {
        if (!providerRepository.existsById(providerId)) {
            throw new RuntimeException("Provider not found with id: " + providerId);
        }

        return reviewRepository.findByProviderId(providerId);
    }
}