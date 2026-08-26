package com.example.spring_boot_jdbc_app.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.spring_boot_jdbc_app.model.Product;
import com.example.spring_boot_jdbc_app.model.ProductDetail;
import com.example.spring_boot_jdbc_app.model.ProductImage;
import com.example.spring_boot_jdbc_app.model.ProductPlusImages;
import com.example.spring_boot_jdbc_app.model.User;
import com.example.spring_boot_jdbc_app.repository.SellerRepository;
import com.example.spring_boot_jdbc_app.security.MyUserDetails;
import com.example.spring_boot_jdbc_app.service.GcsUploadService;
import com.example.spring_boot_jdbc_app.service.ProductService;

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

    @Autowired
    private SellerRepository sellerRepository;

    // @Autowired
    // private UserRepository userRepository;
    @Autowired
    private GcsUploadService gcsUploadService;

    @PostMapping
    public ResponseEntity<String> createProduct(@RequestBody Product product) {
        int result = productService.saveProduct(product);
        if (result > 0) {
            return new ResponseEntity<>("Product added successfully", HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>("Failed to add product", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // CREATE: seller-only, multipart — creează produsul și urcă imaginile în GCS
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadProduct(
            @RequestParam String brand,
            @RequestParam String category,
            @RequestParam String subcategory,
            @RequestParam String description,
            @RequestParam Float price,
            @RequestParam Integer stock,
            @RequestParam String title,
            @RequestParam("images") List<MultipartFile> images,
            Authentication authentication
    ) throws IOException {
        User user = ((MyUserDetails) authentication.getPrincipal()).getUser();
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        if (!sellerRepository.isSeller(user.id())) {
            return new ResponseEntity<>("Trebuie să fii seller ca să adaugi produse.", HttpStatus.FORBIDDEN);
        }
        if (images == null || images.isEmpty()) {
            return new ResponseEntity<>("Trebuie să încarci cel puțin o imagine.", HttpStatus.BAD_REQUEST);
        }

        Product product = new Product(null, user.id(), brand, category, subcategory, description, price, stock, title);
        int productId = productService.saveProduct(product); // saveProduct întoarce id-ul generat

        for (int i = 0; i < images.size(); i++) {
            MultipartFile file = images.get(i);
            String original = file.getOriginalFilename();
            String ext = (original != null && original.contains(".")) ? original.substring(original.lastIndexOf('.')) : ".jpg";
            String filename = productId + "_" + (i + 1) + "-imagine" + ext;

            String publicUrl = gcsUploadService.upload(file, filename);
            productService.saveProductImage(new ProductImage(null, productId, publicUrl, i == 0));
        }

        return new ResponseEntity<>(Map.of("productId", productId), HttpStatus.CREATED);
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

    @GetMapping("/{id}/detail")
    public ResponseEntity<ProductDetail> getProductDetailById(@PathVariable int id) {
        ProductDetail product = productService.getProductByIdPlusImages(id);
        if (product == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchProducts(@RequestParam String q) {
        if (q == null || q.isBlank()) {
            return new ResponseEntity<>("Parametrul q este obligatoriu.", HttpStatus.BAD_REQUEST);
        }
        List<ProductPlusImages> products = productService.searchProducts(q);
        return ResponseEntity.ok(products); // 200 + listă goală dacă nu sunt rezultate
    }
}
