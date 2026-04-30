package com.my_app.rhmvvCYB3R.User.Dto;

public class ChangePasswordRequest {

    private String oldPassword;
    private String newPassword;
    private String confirmPassword;

    public ChangePasswordRequest(){}

    public String getOldPassword() {
        return oldPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }
}