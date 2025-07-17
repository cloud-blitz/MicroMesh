package com.microservices.order.service;

import com.microservices.order.dto.CreateOrderRequest;
import com.microservices.order.model.Order;
import com.microservices.order.model.OrderItem;
import com.microservices.order.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private ProductClient productClient;
    
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
    
    public Optional<Order> getOrderById(String id) {
        return orderRepository.findById(id);
    }
    
    public List<Order> getOrdersByCustomerEmail(String email) {
        return orderRepository.findByCustomerEmail(email);
    }
    
    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status);
    }
    
    public Order createOrder(CreateOrderRequest request) {
        // Validate products and calculate total
        BigDecimal totalAmount = BigDecimal.ZERO;
        
        for (OrderItem item : request.getItems()) {
            // Get product details from Product Service
            Map<String, Object> product = productClient.getProduct(item.getProductId());
            
            // Validate stock availability
            Integer availableStock = (Integer) product.get("stock");
            if (availableStock < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + item.getProductName());
            }
            
            // Update stock in Product Service
            boolean stockUpdated = productClient.updateStock(item.getProductId(), item.getQuantity());
            if (!stockUpdated) {
                throw new RuntimeException("Failed to update stock for product: " + item.getProductName());
            }
            
            // Calculate item total
            BigDecimal itemTotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);
        }
        
        // Create order
        Order order = new Order(request.getCustomerName(), request.getCustomerEmail(), request.getItems(), totalAmount);
        return orderRepository.save(order);
    }
    
    public Optional<Order> updateOrderStatus(String id, String status) {
        return orderRepository.findById(id)
            .map(order -> {
                order.setStatus(status);
                return orderRepository.save(order);
            });
    }
    
    public boolean deleteOrder(String id) {
        if (orderRepository.existsById(id)) {
            orderRepository.deleteById(id);
            return true;
        }
        return false;
    }
} 