package com.example.spring_boot_jdbc_app.model;

/** Public view of a user: everything except the password hash. */
public record UserProfile(
        Integer id,
        String name,
        String surname,
        String username,
        String email,
        String phone,
        Address address,
        boolean admin
) {
    public static UserProfile from(User user, boolean admin) {
        return new UserProfile(user.id(), user.name(), user.surname(), user.username(),
                user.email(), user.phone(), user.address(), admin);
    }
}
