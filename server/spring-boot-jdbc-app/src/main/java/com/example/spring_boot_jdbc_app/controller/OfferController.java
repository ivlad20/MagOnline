package com.example.spring_boot_jdbc_app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.spring_boot_jdbc_app.model.ProductPlusImages;
import com.example.spring_boot_jdbc_app.repository.AdminRepository;
import com.example.spring_boot_jdbc_app.repository.ProductRepository;

/** Public: the "Ofertele săptămânii" carousel on the home page, as chosen in the admin panel. */
@RestController
public class OfferController {

    @Autowired private AdminRepository adminRepository;
    @Autowired private ProductRepository productRepository;

    @GetMapping("/offers")
    public ResponseEntity<List<ProductPlusImages>> getOffers() {
        return ResponseEntity.ok(productRepository.getProductsPlusImagesByIds(adminRepository.getOfferIds()));
    }
}
