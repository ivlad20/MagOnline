package com.example.spring_boot_jdbc_app.service;

import com.example.spring_boot_jdbc_app.model.Product;
import com.example.spring_boot_jdbc_app.model.ProductPlusImages;

import java.util.List;

public interface ProductService {

    int saveProduct(Product product);

    List<Product> getAllProducts();

    Product getProductById(Integer id);

    Product updateProduct(Integer id, Product product);

    int deleteProduct(Integer id);

    List<Product> getProductsByUser(Integer id);

    List<Product> getProductsByBrand(String brand);

    List<Product> getProductsByCategory(String category);

    List<Product> getProductsBySubcategory(String subCategory);

    List<Product> getProductsByBrandAndCategory(String brand, String category);

    List<Product> getProductsByCategoryAndSubcategory(String category, String subCategory);

    List<Product> getProductsByPriceRange(Integer min, Integer max);

    List<ProductPlusImages> getRandomProductsPlusImages(Integer count);
}
