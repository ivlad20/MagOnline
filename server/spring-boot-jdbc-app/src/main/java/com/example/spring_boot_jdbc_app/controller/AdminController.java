package com.example.spring_boot_jdbc_app.controller;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.spring_boot_jdbc_app.model.AdminDtos.AdminOrder;
import com.example.spring_boot_jdbc_app.model.AdminDtos.AdminProduct;
import com.example.spring_boot_jdbc_app.model.AdminDtos.OffersUpdate;
import com.example.spring_boot_jdbc_app.model.AdminDtos.OrderUpdate;
import com.example.spring_boot_jdbc_app.model.AdminDtos.ProductUpdate;
import com.example.spring_boot_jdbc_app.model.AdminDtos.QueryResult;
import com.example.spring_boot_jdbc_app.model.AdminDtos.SalesStats;
import com.example.spring_boot_jdbc_app.model.AdminDtos.SqlQuery;
import com.example.spring_boot_jdbc_app.model.AdminDtos.TableInfo;
import com.example.spring_boot_jdbc_app.model.ApiException;
import com.example.spring_boot_jdbc_app.repository.AdminRepository;
import com.example.spring_boot_jdbc_app.repository.DatabaseConsoleRepository;

/** Admin panel API. Every route here requires ROLE_ADMIN (see SecurityConfig). */
@RestController
@RequestMapping("/admin")
public class AdminController {

    private static final Set<Integer> PERIODS = Set.of(7, 30, 90, 365);

    @Autowired private AdminRepository adminRepository;
    @Autowired private DatabaseConsoleRepository databaseConsole;

    @GetMapping("/stats")
    public SalesStats stats(@RequestParam(defaultValue = "30") int days) {
        return adminRepository.getSalesStats(PERIODS.contains(days) ? days : 30);
    }

    @GetMapping("/orders")
    public List<AdminOrder> orders(@RequestParam(required = false) String status,
                                   @RequestParam(required = false) String q) {
        return adminRepository.getOrders(status, q);
    }

    @PatchMapping("/orders/{id}")
    public ResponseEntity<Void> updateOrder(@PathVariable int id, @RequestBody OrderUpdate update) {
        adminRepository.updateOrder(id, update);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/products")
    public List<AdminProduct> products(@RequestParam(required = false) String q) {
        return adminRepository.getProducts(q);
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<Void> updateProduct(@PathVariable int id, @RequestBody ProductUpdate update) {
        adminRepository.updateProduct(id, update);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable int id) {
        adminRepository.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/offers")
    public List<AdminProduct> offers() {
        return adminRepository.getOffers();
    }

    @PutMapping("/offers")
    public List<AdminProduct> setOffers(@RequestBody OffersUpdate update) {
        adminRepository.setOffers(update.productIds());
        return adminRepository.getOffers();
    }

    @GetMapping("/db/tables")
    public List<TableInfo> tables() {
        return databaseConsole.listTables();
    }

    @GetMapping("/db/tables/{name}")
    public QueryResult table(@PathVariable String name, @RequestParam(defaultValue = "0") int page,
                             @RequestParam(defaultValue = "50") int size) {
        return databaseConsole.browseTable(name, page, size);
    }

    @PostMapping("/db/query")
    public QueryResult query(@RequestBody SqlQuery query) {
        return databaseConsole.runReadOnly(query.sql());
    }

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<String> handleApi(ApiException e) {
        return ResponseEntity.status(e.getStatus()).body(e.getMessage());
    }

    /** SQL errors from the console (syntax, unknown column, write in read-only transaction...). */
    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<String> handleSql(DataAccessException e) {
        Throwable root = e.getMostSpecificCause();
        return ResponseEntity.badRequest().body("Eroare SQL: " + (root.getMessage() == null ? e.getMessage() : root.getMessage()));
    }
}
