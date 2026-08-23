package com.example.spring_boot_jdbc_app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.example.spring_boot_jdbc_app.model.JWTResponse;
import com.example.spring_boot_jdbc_app.model.LoginRequest;
import com.example.spring_boot_jdbc_app.model.User;
import com.example.spring_boot_jdbc_app.repository.UserRepository;
import com.example.spring_boot_jdbc_app.security.JwtUtil;
import com.example.spring_boot_jdbc_app.security.MyUserDetails;
import com.example.spring_boot_jdbc_app.service.UserServiceImp;

@CrossOrigin(
        origins = {"http://localhost:3000", "http://127.0.0.1:3000"},
        allowCredentials = "true",
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}
)
@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserServiceImp userService;
    @Autowired
    private JwtUtil jwtUtil;

    // CREATE: Add a new user
    @PostMapping
    public ResponseEntity<String> createUser(@RequestBody User user) {
        int result = userRepository.saveUser(user);
        if (result == 1) {
            return new ResponseEntity<>("User created successfully", HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>("Failed to create user", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // READ: Get all users
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    // READ: Get a user by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Integer id) {
        User user = userRepository.getUserById(id);
        if (user != null) {
            return new ResponseEntity<>(user, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // UPDATE: Update an existing user
    @PutMapping("/{id}")
    public ResponseEntity<String> updateUser(@PathVariable Integer id, @RequestBody User updatedUser) {
        // First, check if the user exists
        User existingUser = userRepository.getUserById(id);
        if (existingUser != null) {
            // Set the ID of the updated user to the path variable id
            User userToUpdate = new User(id, updatedUser.name(), updatedUser.surname(), updatedUser.username(), updatedUser.email(), updatedUser.address(), updatedUser.phone(), updatedUser.password());
            int result = userRepository.updateUser(userToUpdate);
            if (result == 1) {
                return new ResponseEntity<>("User updated successfully", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Failed to update user", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
    }

    // DELETE: Delete a user
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Integer id) {
        int result = userRepository.deleteUser(id);
        if (result == 1) {
            return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Failed to delete user", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        System.out.println(request.email() + " " + request.password());
        try {
            // 1. Autentifică utilizatorul
            MyUserDetails userDetails = (MyUserDetails) userService.authenticate(request.email(), request.password());

            // 2. Generează token JWT
            String token = jwtUtil.generateToken(userDetails.getEmail(), userDetails.getUsername());

            // 3. Returnează tokenul
            return ResponseEntity.ok(new JWTResponse(token));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Username sau parolă incorecte.");
        }
    }

}
