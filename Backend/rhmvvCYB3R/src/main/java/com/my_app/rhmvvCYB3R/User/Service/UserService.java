package com.my_app.rhmvvCYB3R.User.Service;

import com.my_app.rhmvvCYB3R.User.Dto.LoginRequest;
import com.my_app.rhmvvCYB3R.User.Dto.LoginResponse;
import com.my_app.rhmvvCYB3R.User.Dto.RegisterRequest;
import com.my_app.rhmvvCYB3R.User.Entity.User;
import com.my_app.rhmvvCYB3R.User.Entity.VerificationToken;
import com.my_app.rhmvvCYB3R.User.Mapper.UserMapper;
import com.my_app.rhmvvCYB3R.User.Repo.UserRepository;
import com.my_app.rhmvvCYB3R.User.Repo.VerificationTokenRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VerificationTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // REGISTER
    public String register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setVerified(false);
        userRepository.save(user);

        VerificationToken token = new VerificationToken(user);
        tokenRepository.save(token);
        emailService.sendVerificationEmail(user, token);

        return "Check your email for verification code";
    }

    // VERIFY EMAIL
    public String verifyEmail(String token) {
        VerificationToken verificationToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));
        System.out.println("INPUT: " + token);
        tokenRepository.findAll().forEach(t ->
                System.out.println("DB: " + t.getToken())
        );
        if (verificationToken.isExpired()) {
            tokenRepository.delete(verificationToken);
            throw new RuntimeException("Token expired, please register again");
        }

        User user = verificationToken.getUser();
        user.setVerified(true);
        userRepository.save(user);

        tokenRepository.delete(verificationToken);

        return "Email verified successfully";
    }

    // LOGIN
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getVerified()) {
            throw new RuntimeException("Email not verified");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return UserMapper.toLoginResponse(user, token);
    }
    //resend verify code
    public String resendVerificationCode(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getVerified()) {
            throw new RuntimeException("Email is already verified");
        }

        // Delete any existing token for this user before creating a new one
        tokenRepository.findByUser(user).ifPresent(token -> tokenRepository.delete(token));

        VerificationToken newToken = new VerificationToken(user);
        tokenRepository.save(newToken);

        emailService.sendVerificationEmail(user, newToken);

        return "Verification code has been resent";
    }



    public String sendResetPasswordCode(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User with this email not found"));

        tokenRepository.findByUser(user).ifPresent(tokenRepository::delete);

        VerificationToken newToken = new VerificationToken(user);
        tokenRepository.save(newToken);

        emailService.sendVerificationEmail(user, newToken);

        return "Reset code sent to your email";
    }

    public boolean verifyCodeOnly(String email, String code) {
        VerificationToken verificationToken = tokenRepository.findByToken(code)
                .orElseThrow(() -> new RuntimeException("Invalid reset code"));

        if (!verificationToken.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Code does not match this email");
        }

        if (verificationToken.isExpired()) {
            tokenRepository.delete(verificationToken);
            throw new RuntimeException("Code expired");
        }

        return true;
    }

    @Transactional
    public String resetPassword(String email, String code, String newPassword, String confirmPassword) {
        VerificationToken verificationToken = tokenRepository.findByToken(code)
                .orElseThrow(() -> new RuntimeException("Invalid reset code"));

        if (!verificationToken.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Code does not match this email");
        }

        if (verificationToken.isExpired()) {
            tokenRepository.delete(verificationToken);
            throw new RuntimeException("Code expired");
        }

        if (!newPassword.equals(confirmPassword)) {
            throw new RuntimeException("Passwords do not match");
        }

        User user = verificationToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        tokenRepository.delete(verificationToken);

        return "Password reset successfully";
    }
}

