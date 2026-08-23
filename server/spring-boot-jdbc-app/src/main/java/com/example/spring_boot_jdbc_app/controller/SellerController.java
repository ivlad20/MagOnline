package com.example.spring_boot_jdbc_app.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.example.spring_boot_jdbc_app.model.Seller;
import com.example.spring_boot_jdbc_app.model.User;
import com.example.spring_boot_jdbc_app.repository.SellerRepository;
import com.example.spring_boot_jdbc_app.security.MyUserDetails;

@CrossOrigin(
        origins = {"http://localhost:3000", "http://127.0.0.1:3000"},
        allowCredentials = "true", allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS}
)
@RestController
@RequestMapping("/sellers")
public class SellerController {

    @Autowired private SellerRepository sellerRepository;
    // @Autowired private UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getMyStatus(Authentication authentication) {
        User user = ((MyUserDetails) authentication.getPrincipal()).getUser();

        Seller seller = sellerRepository.getSellerByUserId(user.id());
        return ResponseEntity.ok(Map.of("isSeller", seller != null, "seller", seller));
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerAsSeller(@RequestBody Seller sellerRequest, Authentication authentication) {
        User user = ((MyUserDetails) authentication.getPrincipal()).getUser();

        if (sellerRepository.getSellerByUserId(user.id()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Ești deja seller.");
        }

        Seller seller = new Seller(user.id(), sellerRequest.companyName(), sellerRequest.cui(),
                sellerRequest.address(), sellerRequest.phone(), sellerRequest.iban());
        sellerRepository.createSeller(seller);

        return ResponseEntity.status(HttpStatus.CREATED).body("Cont de seller creat.");
    }
}