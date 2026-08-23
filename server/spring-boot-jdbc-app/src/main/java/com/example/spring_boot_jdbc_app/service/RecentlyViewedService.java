package com.example.spring_boot_jdbc_app.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.spring_boot_jdbc_app.model.ProductDetail;
import com.example.spring_boot_jdbc_app.repository.RecentlyViewedRepository;

@Service
public class RecentlyViewedService {

    private static final int HISTORY_LIMIT = 10;

    @Autowired
    private RecentlyViewedRepository recentlyViewedRepository;

    @Autowired
    private ProductService productService;

    public void recordView(int userId, int productId) {
        recentlyViewedRepository.upsertView(userId, productId);
    }

    public List<ProductDetail> getRecentlyViewed(int userId) {
        List<Integer> productIds = recentlyViewedRepository.getRecentProductIds(userId, HISTORY_LIMIT);

        List<ProductDetail> products = new ArrayList<>();
        for (Integer id : productIds) {
            ProductDetail product = productService.getProductByIdPlusImages(id);
            if (product != null) { // produsul ar putea fi șters între timp
                products.add(product);
            }
        }
        return products;
    }
}