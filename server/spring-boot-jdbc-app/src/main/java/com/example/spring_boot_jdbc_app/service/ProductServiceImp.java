package com.example.spring_boot_jdbc_app.service;

import com.example.spring_boot_jdbc_app.model.Product;
import com.example.spring_boot_jdbc_app.model.ProductPlusImages;
import com.example.spring_boot_jdbc_app.model.User;
import com.example.spring_boot_jdbc_app.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImp implements ProductService {

    @Autowired
    ProductRepository productRepository;

    @Override
    public int saveProduct(Product product) {
        return productRepository.saveProduct(product);
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.getAllProducts();
    }

    @Override
    public Product getProductById(Integer id) {
        return productRepository.getProductById(id);
    }

    @Override
    public Product updateProduct(Integer id, Product updatedProduct) {
        // Check if the user exists before updating
        Product existingProduct = productRepository.getProductById(id);
        if (existingProduct != null) {
            // Create a new User object with the existing ID and updated details
            Product prodToUpdate = new Product(
                    id,
                    updatedProduct.seller_id(),
                    updatedProduct.brand(),
                    updatedProduct.category(),
                    updatedProduct.subcategory(),
                    updatedProduct.description(),
                    updatedProduct.price(),
                    updatedProduct.stock()
            );
            return productRepository.updateProduct(prodToUpdate);
        }
        return null;
    }

    @Override
    public int deleteProduct(Integer id) {
        return productRepository.deleteProduct(id);
    }

    @Override
    public List<Product> getProductsByUser(Integer id) {
        return productRepository.getProductsByUser(id);
    }

    @Override
    public List<Product> getProductsByBrand(String brand) {
        return productRepository.getProductsByBrand(brand);
    }

    @Override
    public List<Product> getProductsByCategory(String category) {
        return productRepository.getProductsByCategory(category);
    }

    @Override
    public List<Product> getProductsBySubcategory(String subcategory) {
        return productRepository.getProductsBySubcategory(subcategory);
    }

    @Override
    public List<Product> getProductsByBrandAndCategory(String brand, String category) {
        return productRepository.getProductsByBrandAndCategory(brand, category);
    }

    @Override
    public List<Product> getProductsByCategoryAndSubcategory(String category, String subcategory) {
        return productRepository.getProductsByCategoryAndSubcategory(category, subcategory);
    }

    @Override
    public List<Product> getProductsByPriceRange(Integer min, Integer max) {
        return productRepository.getProductsByPriceRange(min, max);
    }

    @Override
    public List<ProductPlusImages> getRandomProductsPlusImages(Integer count) {
        return productRepository.getRandomProductsPlusImages(count);
    }
}
