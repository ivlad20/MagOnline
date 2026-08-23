package com.example.spring_boot_jdbc_app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.example.spring_boot_jdbc_app.model.ProductDetail;
import com.example.spring_boot_jdbc_app.model.User;
import com.example.spring_boot_jdbc_app.security.MyUserDetails;
import com.example.spring_boot_jdbc_app.service.RecentlyViewedService;

@CrossOrigin(
        origins = {"http://localhost:3000", "http://127.0.0.1:3000"},
        allowCredentials = "true",
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS}
)
@RestController
@RequestMapping("/recently-viewed")
public class RecentlyViewedController {

    @Autowired
    private RecentlyViewedService recentlyViewedService;

    @PostMapping("/{productId}")
    public ResponseEntity<Void> recordView(@PathVariable int productId, Authentication authentication) {
        User user = ((MyUserDetails) authentication.getPrincipal()).getUser();
        recentlyViewedService.recordView(user.id(), productId);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<ProductDetail>> getRecentlyViewed(Authentication authentication) {
        User user = ((MyUserDetails) authentication.getPrincipal()).getUser();
        List<ProductDetail> products = recentlyViewedService.getRecentlyViewed(user.id());
        return ResponseEntity.ok(products);
    }
}