package com.example.spring_boot_jdbc_app.service;

import com.example.spring_boot_jdbc_app.model.User;
import com.example.spring_boot_jdbc_app.repository.UserRepository;
import com.example.spring_boot_jdbc_app.security.JwtUtil;
import com.example.spring_boot_jdbc_app.security.MyUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImp implements UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;

    // CREATE: Add a new user
    @Override
    public int saveUser(User user) {
        // You can add additional business logic here, such as validation
        return userRepository.saveUser(user);
    }

    // READ: Get all users
    @Override
    public List<User> getAllUsers() {
        return userRepository.getAllUsers();
    }

    // READ: Get user by ID
    @Override
    public User getUserById(Integer id) {
        return userRepository.getUserById(id);
    }

    // UPDATE: Update an existing user
    @Override
    public int updateUser(Integer id, User updatedUser) {
        // Check if the user exists before updating
        User existingUser = userRepository.getUserById(id);
        if (existingUser != null) {
            // Create a new User object with the existing ID and updated details
            User userToUpdate = new User(
                    id,
                    updatedUser.name(),
                    updatedUser.surname(),
                    updatedUser.username(),
                    updatedUser.email(),
                    updatedUser.address(),
                    updatedUser.phone(),
                    updatedUser.password()
            );
            return userRepository.updateUser(userToUpdate);
        }
        return 0; // User not found, return 0 (or handle it differently)
    }

    // DELETE: Delete a user
    @Override
    public int deleteUser(Integer id) {
        // You can add any additional business logic here
        return userRepository.deleteUser(id);
    }

    // READ: Get user by email
    @Override
    public User getUserByEmail(String email) {
        return userRepository.getUserByEmail(email);
    }

    // Login and generate web token

    public UserDetails authenticate(String email, String password) {
        User user = userRepository.getUserByEmail(email);
        if (user == null || !passwordEncoder.matches(password, user.password())) {
            throw new BadCredentialsException("Invalid email or password");
        }
        return new MyUserDetails(user);
    }


}
