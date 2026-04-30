package com.my_app.rhmvvCYB3R.User.Mapper;

import com.my_app.rhmvvCYB3R.User.Dto.LoginResponse;
import com.my_app.rhmvvCYB3R.User.Entity.User;

public class UserMapper {

    // User → LoginResponse
    public static LoginResponse toLoginResponse(User user, String token) {
        return new LoginResponse(token, user.getEmail());
    }
}