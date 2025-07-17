package com.example.spring_boot_jdbc_app.service;

import com.example.spring_boot_jdbc_app.model.User;

import java.util.List;

public interface UserService {
    // CREATE
    int saveUser(User user);

    // READ
    List<User> getAllUsers();

    User getUserById(Integer id);

    // UPDATE
    int updateUser(Integer id, User user);

    // DELETE
    int deleteUser(Integer id);

    User getUserByEmail(String email);
}
