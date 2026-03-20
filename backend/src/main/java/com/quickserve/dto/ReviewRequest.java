package com.quickserve.dto;

public class ReviewRequest {

    private Long customerId;
    private Long providerId;
    private int rating;
    private String comment;

    public ReviewRequest() {
    }

    public ReviewRequest(Long customerId, Long providerId, int rating, String comment) {
        this.customerId = customerId;
        this.providerId = providerId;
        this.rating = rating;
        this.comment = comment;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Long getProviderId() {
        return providerId;
    }

    public void setProviderId(Long providerId) {
        this.providerId = providerId;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}