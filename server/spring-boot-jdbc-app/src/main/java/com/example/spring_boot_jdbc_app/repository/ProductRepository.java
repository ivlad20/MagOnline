package com.example.spring_boot_jdbc_app.repository;

import com.example.spring_boot_jdbc_app.model.*;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PostMapping;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Repository
public class ProductRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private RowMapper<Product> productRowMapper = (rs, rowNum) -> {

        return new Product(
                rs.getInt("id"),
                rs.getInt("seller_id"),
                rs.getString("brand"),
                rs.getString("category"),
                rs.getString("subcategory"),
                rs.getString("description"),
                rs.getFloat("price"),
                rs.getInt("stock")
        );
    };

    public int saveProduct(Product product) {
        // Inserare în tabela products
        String productSql = "INSERT INTO products (seller_id, brand, category, subcategory, description, price, stock) VALUES (?, ?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(productSql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, product.seller_id());
            ps.setString(2, product.brand());
            ps.setString(3, product.category());
            ps.setString(4, product.subcategory());
            ps.setString(5, product.description());
            ps.setFloat(6, product.price());
            ps.setInt(7, product.stock());
            return ps;
        }, keyHolder);

        return keyHolder.getKey().intValue();

    }

    public List<Product> getAllProducts() {
        String sql = "SELECT * FROM products";
        return jdbcTemplate.query(sql, productRowMapper);
    }

    public Product getProductById(int id) {
        String sql = "SELECT * FROM products WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, productRowMapper, id);
    }

    public Product updateProduct(Product product) {
        String sql = "UPDATE products SET seller_id = ?, brand = ?, category = ?, subcategory = ?, description = ?, price = ?, stock = ? WHERE id = ?";
        int rows = jdbcTemplate.update(sql,
                product.seller_id(),
                product.brand(),
                product.category(),
                product.subcategory(),
                product.description(),
                product.price(),
                product.stock(),
                product.id()
        );

        return rows == 1 ? getProductById(product.id()) : null;
    }

    public int deleteProduct(Integer id) {
        String sql = "DELETE FROM products WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public List<Product> getProductsByUser(Integer seller_id) {
        String sql = "SELECT * FROM products WHERE seller_id = ?";
        return jdbcTemplate.query(sql, productRowMapper, seller_id);
    }

    public List<Product> getProductsByBrand(String brand) {
        String sql = "SELECT * FROM products WHERE brand = ?";
        return jdbcTemplate.query(sql, productRowMapper, brand);
    }

    public List<Product> getProductsByCategory(String category) {
        String sql = "SELECT * FROM products WHERE category = ?";
        return jdbcTemplate.query(sql, productRowMapper, category);
    }

    public List<Product> getProductsBySubcategory(String subcategory) {
        String sql = "SELECT * FROM products WHERE subcategory = ?";
        return jdbcTemplate.query(sql, productRowMapper, subcategory);
    }

    public List<Product> getProductsByBrandAndCategory(String brand, String category) {
        String sql = "SELECT * FROM products WHERE brand = ? AND category = ?";
        return jdbcTemplate.query(sql, productRowMapper, brand, category);
    }

    public List<Product> getProductsByCategoryAndSubcategory(String category, String subcategory) {
        String sql = "SELECT * FROM products WHERE category = ? AND subcategory = ?";
        return jdbcTemplate.query(sql, productRowMapper, category, subcategory);
    }

    public List<Product> getProductsByPriceRange(Integer min, Integer max) {
        String sql = "SELECT * FROM products WHERE price >= ? and price <= ?";
        return jdbcTemplate.query(sql, productRowMapper, min, max);
    }

    public List<ProductPlusImages> getRandomProductsPlusImages(Integer count) {
        // Step 1: Fetch random products
        String productSql = "SELECT * FROM products ORDER BY RAND() LIMIT ?";
        List<Product> products = jdbcTemplate.query(productSql, productRowMapper, count);

        List<Integer> productIds = products.stream()
                .map(Product::id)
                .toList();

        if (productIds.isEmpty()) return List.of();

        // Step 2: Fetch all images for those product IDs
        String imageSql = """
        SELECT product_id, image_url, is_main 
        FROM images 
        WHERE product_id IN (%s)
        """.formatted(
                productIds.stream().map(String::valueOf).collect(Collectors.joining(","))
        );

        // Map product_id -> List<ImageData>
        Map<Integer, List<ImageData>> imageMap = new HashMap<>();
        jdbcTemplate.query(imageSql, rs -> {
            int pid = rs.getInt("product_id");
            String url = rs.getString("image_url");
            boolean isMain = rs.getBoolean("is_main");

            imageMap.computeIfAbsent(pid, k -> new ArrayList<>())
                    .add(new ImageData(url, isMain));
        });

        // Step 3: Build the list of ProductPlusImages
        return products.stream().map(p -> {
            List<ImageData> imgs = imageMap.getOrDefault(p.id(), List.of());

            String mainImage = imgs.stream()
                    .filter(ImageData::isMain)
                    .map(ImageData::url)
                    .findFirst()
                    .orElse(null);

            List<String> additionalImages = imgs.stream()
                    .filter(i -> !i.isMain())
                    .map(ImageData::url)
                    .toList();

            return new ProductPlusImages(
                    p.id(),
                    p.brand(),
                    p.category(),
                    p.subcategory(),
                    p.description(),
                    p.price(),
                    p.stock(),
                    mainImage,
                    additionalImages
            );
        }).toList();
    }

}
