package com.example.spring_boot_jdbc_app.controller;

import com.example.spring_boot_jdbc_app.model.Product;
import com.example.spring_boot_jdbc_app.model.ProductPlusImages;
import com.example.spring_boot_jdbc_app.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(
        origins = {"http://localhost:3000", "http://127.0.0.1:3000"},
        allowCredentials = "true",
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}
)
@RestController
@RequestMapping("/products")

public class ProductController {
    @Autowired
    private ProductService productService;

    @PostMapping
    public ResponseEntity<String> createProduct(@RequestBody Product product) {
        int result = productService.saveProduct(product);
        if (result > 0) {
            return new ResponseEntity<>("Product added successfully", HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>("Failed to add product", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        if (products.isEmpty()) {
            return new ResponseEntity<>(products, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable int id) {
        Product product = productService.getProductById(id);
        if (product == null) {
            return new ResponseEntity<>(product, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable int id, @RequestBody Product product) {
        Product updatedProduct = productService.updateProduct(id, product);
        if (updatedProduct != null) {
            return new ResponseEntity<>(updatedProduct, HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable int id) {
        int result = productService.deleteProduct(id);
        if (result == 1) {
            return new ResponseEntity<>("Product deleted successfully", HttpStatus.OK);
        }
        return new ResponseEntity<>("Failed to delete product", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<List<Product>> getProductsByUser(@PathVariable int id) {
        List<Product> products = productService.getProductsByUser(id);
        if (products.isEmpty()) {
            return new ResponseEntity<>(products, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/brand/{brand}")
    public ResponseEntity<List<Product>> getProductsByBrand(@PathVariable String brand) {
        List<Product> products = productService.getProductsByBrand(brand);
        if (products.isEmpty()) {
            return new ResponseEntity<>(products, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String category) {
        List<Product> products = productService.getProductsByCategory(category);
        if (products.isEmpty()) {
            return new ResponseEntity<>(products, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/subcategory/{subcategory}")
    public ResponseEntity<List<Product>> getProductsBySubcategory(@PathVariable String subcategory) {
        List<Product> products = productService.getProductsBySubcategory(subcategory);
        if (products.isEmpty()) {
            return new ResponseEntity<>(products, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/brand/category/{brand}/{category}")
    public ResponseEntity<List<Product>> getProductsByBrandAnCategory(@PathVariable String brand, @PathVariable String category) {
        List<Product> products = productService.getProductsByBrandAndCategory(brand, category);
        if (products.isEmpty()) {
            return new ResponseEntity<>(products, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/category/subcategory/{category}/{subcategory}")
    public ResponseEntity<List<Product>> getProductsByCategoryAndSubcategory(@PathVariable String category, @PathVariable String subcategory) {
        List<Product> products = productService.getProductsByCategoryAndSubcategory(category, subcategory);
        if (products.isEmpty()) {
            return new ResponseEntity<>(products, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/price/{min}/{max}")
    public ResponseEntity<List<Product>> getProductsByPrice(@PathVariable int min, @PathVariable int max) {
        List<Product> products = productService.getProductsByPriceRange(min, max);
        if (products.isEmpty()) {
            return new ResponseEntity<>(products, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(products, HttpStatus.OK);
    }


    @GetMapping("/random/{count}")
    public ResponseEntity<List<ProductPlusImages>> getRandomProducts(@PathVariable Integer count) {
        List<ProductPlusImages> products = productService.getRandomProductsPlusImages(count);
        return ResponseEntity.ok(products);
    }
}
