package com.example.spring_boot_jdbc_app.repository;

import com.example.spring_boot_jdbc_app.model.Address;
import com.example.spring_boot_jdbc_app.model.Product;
import com.example.spring_boot_jdbc_app.model.User;
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
import java.util.List;

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
}
