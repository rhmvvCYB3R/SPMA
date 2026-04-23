package com.my_app.rhmvvCYB3R.User.Dto;

public class LoginResponse {
    private String token; //JWT (HEADER.PAYLOAD.SIGNATURE)
    private String email;

    public LoginResponse(){

    }

    public  LoginResponse(String token,String email){
        this.token=token;
        this.email=email;

    }

    //getters

    public String getToken() {
        return token;
    }

    public String getEmail() {
        return email;
    }

    //setters

    public void setToken(String token) {
        this.token = token;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
