package com.microservices.order.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@Service
public class ProductClient {
    
    @Value("${product.service.url:http://localhost:8082}")
    private String productServiceUrl;
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    public Map<String, Object> getProduct(String productId) {
        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(
                productServiceUrl + "/api/products/" + productId, 
                Map.class
            );
            return response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Failed to get product: " + productId, e);
        }
    }
    
    public boolean updateStock(String productId, Integer quantity) {
        try {
            ResponseEntity<Boolean> response = restTemplate.exchange(
                productServiceUrl + "/api/products/" + productId + "/stock?quantity=" + quantity,
                org.springframework.http.HttpMethod.PUT,
                null,
                Boolean.class
            );
            return response.getBody() != null && response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Failed to update stock for product: " + productId, e);
        }
    }
} 