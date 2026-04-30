package com.my_app.rhmvvCYB3R.User.Controller;

import com.my_app.rhmvvCYB3R.User.Dto.LoginRequest;
import com.my_app.rhmvvCYB3R.User.Dto.LoginResponse;
import com.my_app.rhmvvCYB3R.User.Dto.MessageResponse;
import com.my_app.rhmvvCYB3R.User.Dto.RegisterRequest;
import com.my_app.rhmvvCYB3R.User.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<MessageResponse> register(@RequestBody RegisterRequest request) {



        String message = userService.register(request);
        return ResponseEntity.ok(new MessageResponse(message));
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }

    // POST /api/auth/verify
    @PostMapping("/verify")
    public ResponseEntity<MessageResponse> verify(@RequestBody MessageResponse request) {
        String message = userService.verifyEmail(request.getMessage());
        return ResponseEntity.ok(new MessageResponse(message));
    }

    @PostMapping("/resend-verify")
    public ResponseEntity<MessageResponse> resendVerify(@RequestParam String email) {
        String message = userService.resendVerificationCode(email);
        return ResponseEntity.ok(new MessageResponse(message));
    }
    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponse> forgotPassword(@RequestParam String email) {
        String message = userService.sendResetPasswordCode(email);
        return ResponseEntity.ok(new MessageResponse(message));
    }

    @PutMapping("/reset-password")
    public ResponseEntity<MessageResponse> resetPassword(
            @RequestParam String email,
            @RequestParam String code,
            @RequestBody RegisterRequest request) {
        String message = userService.resetPassword(email, code, request.getPassword(), request.getConfirmPassword());
        return ResponseEntity.ok(new MessageResponse(message));


}
    @PutMapping("/verify-reset-code")
    public ResponseEntity<?> verifyResetCode(@RequestParam String email, @RequestParam String code) {
        try {
            boolean isValid = userService.verifyCodeOnly(email, code);
            return ResponseEntity.ok(new MessageResponse("Code is valid"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(e.getMessage()));
        }
    }
}