package com.example.spring_boot_jdbc_app.service;

import com.example.spring_boot_jdbc_app.model.User;
import com.example.spring_boot_jdbc_app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImp implements UserService {

    @Autowired
    private UserRepository userRepository;

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
                    updatedUser.phone()
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

}
