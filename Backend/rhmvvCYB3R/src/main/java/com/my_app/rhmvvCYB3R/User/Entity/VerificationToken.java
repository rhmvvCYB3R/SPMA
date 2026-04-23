package com.my_app.rhmvvCYB3R.User.Entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Random;

@Entity
@Table(name = "verification_token")
public class VerificationToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false,unique = true)
    private String token;

    @OneToOne
    @JoinColumn(name = "user_id",nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    //empty consturtor, important because jpa creates object by it
    public VerificationToken(){

    }
    public VerificationToken(User user){
        this.token= generateToken(); //generate token
        this.user = user; //connect user
        this.expiresAt = LocalDateTime.now().plusMinutes(15); //token lifecycle 15min

    }

    private String generateToken(){
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; //36symbols
        Random random = new Random();
        StringBuilder token = new StringBuilder();
        for(int i = 0; i<4; i++){ // create like A5X8
            token.append(chars.charAt(random.nextInt(chars.length())));
        }
        return token.toString();
    }

    public boolean isExpired(){
        return LocalDateTime.now().isAfter(this.expiresAt);
    }

    //getters
    public Long getId() {
        return id;
    }

    public String getToken() {
        return token;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public User getUser() {
        return user;
    }

    //setters

    public void setId(Long id) {
        this.id = id;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
