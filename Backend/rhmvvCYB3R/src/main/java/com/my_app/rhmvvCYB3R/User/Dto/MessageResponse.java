package com.my_app.rhmvvCYB3R.User.Dto;
//just json message response like "REGISTRATION IS SUCCESSFUL"
public class MessageResponse {
    private String message;
    public MessageResponse(){

    }

    public MessageResponse(String message){
        this.message = message;

    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
