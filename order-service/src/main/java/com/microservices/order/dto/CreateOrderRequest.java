package com.microservices.order.dto;

import com.microservices.order.model.OrderItem;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class CreateOrderRequest {
    @NotBlank
    private String customerName;
    
    @Email
    @NotBlank
    private String customerEmail;
    
    @NotEmpty
    @Valid
    private List<OrderItem> items;
    
    public CreateOrderRequest() {}
    
    public CreateOrderRequest(String customerName, String customerEmail, List<OrderItem> items) {
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.items = items;
    }
    
    // Getters and Setters
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
    
    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }
} 