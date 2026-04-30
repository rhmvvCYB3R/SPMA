package com.my_app.rhmvvCYB3R.User.Entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false,unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private Boolean isVerified;

    private LocalDateTime createdAt = LocalDateTime.now();


    //empty consturtor, important because jpa creates object by it
    public User() {

    }


    //CONSTRUCTOR
    public User(String email, String password) {
        this.email = email;
        this.password = password;
        this.isVerified = false;
    }
    //__________________________
    //GETTERS
    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Boolean getVerified() {
        return isVerified;
    }
    //___________________________
    //SETTERS
    public void setId(Long id) {
        this.id = id;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setVerified(Boolean verified) {
        this.isVerified = verified;
    }
}
