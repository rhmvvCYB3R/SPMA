package com.my_app.rhmvvCYB3R.User.Dto;

public class RegisterRequest {
    private String email;
    private String password;
    private String confirmPassword;

    public RegisterRequest(){

    }

    public RegisterRequest(String email, String password, String confirmPassword){
        this.email = email;
        this.password = password;
        this.confirmPassword=password;

    }

    //getters
    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    //setters

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }
}
