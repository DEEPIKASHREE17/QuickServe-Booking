package com.quickserve.dto;

public class CreateOrderRequest {

    private int amount;

    public CreateOrderRequest() {
    }

    public CreateOrderRequest(int amount) {
        this.amount = amount;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }
}