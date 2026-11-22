package com.example.spring_boot_jdbc_app.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.spring_boot_jdbc_app.model.CheckoutException;
import com.example.spring_boot_jdbc_app.model.CheckoutRequest;
import com.example.spring_boot_jdbc_app.model.OrderSummary;
import com.example.spring_boot_jdbc_app.model.User;
import com.example.spring_boot_jdbc_app.repository.OrderRepository;
import com.example.spring_boot_jdbc_app.security.MyUserDetails;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired private OrderRepository orderRepository;

    /** Orders of the logged-in user. */
    @GetMapping("/me")
    public ResponseEntity<List<OrderSummary>> getMyOrders(Authentication authentication) {
        User user = ((MyUserDetails) authentication.getPrincipal()).getUser();
        return ResponseEntity.ok(orderRepository.getOrdersByUserId(user.id()));
    }

    /** Checkout: places an order for the logged-in user. */
    @PostMapping
    public ResponseEntity<Map<String, Integer>> placeOrder(@RequestBody CheckoutRequest request,
                                                           Authentication authentication) {
        User user = ((MyUserDetails) authentication.getPrincipal()).getUser();
        int orderId = orderRepository.createOrder(user.id(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("orderId", orderId));
    }

    /** User-fixable checkout problems go back as plain text, like the other endpoints. */
    @ExceptionHandler(CheckoutException.class)
    public ResponseEntity<String> handleCheckout(CheckoutException e) {
        return ResponseEntity.status(e.getStatus()).body(e.getMessage());
    }
}
