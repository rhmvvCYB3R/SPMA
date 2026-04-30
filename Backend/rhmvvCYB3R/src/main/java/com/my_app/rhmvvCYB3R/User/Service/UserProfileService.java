package com.my_app.rhmvvCYB3R.User.Service;

import com.my_app.rhmvvCYB3R.User.Dto.*;
import com.my_app.rhmvvCYB3R.User.Entity.User;
import com.my_app.rhmvvCYB3R.User.Entity.VerificationToken;
import com.my_app.rhmvvCYB3R.User.Repo.UserRepository;
import com.my_app.rhmvvCYB3R.User.Repo.VerificationTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserProfileService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VerificationTokenRepository tokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    private User getAuthUser() {
        String email =
                SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getPrincipal()
                        .toString();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getCurrentUser() {
        return getAuthUser();
    }

    public String changePassword(ChangePasswordRequest request) {

        User user = getAuthUser();

        if (!passwordEncoder.matches(
                request.getOldPassword(),
                user.getPassword()
        )) {
            throw new RuntimeException("Old password invalid");
        }

        if (!request.getNewPassword()
                .equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }

        user.setPassword(
                passwordEncoder.encode(request.getNewPassword())
        );

        userRepository.save(user);

        return "Password changed";
    }

    public String requestEmailChange(ChangeEmailRequest request) {

        if (userRepository.existsByEmail(request.getNewEmail())) {
            throw new RuntimeException("Email already used");
        }

        User user = getAuthUser();

        user.setEmail(request.getNewEmail());
        user.setVerified(false);

        userRepository.save(user);

        VerificationToken token = new VerificationToken(user);
        tokenRepository.save(token);

        emailService.sendVerificationEmail(user, token);

        return "Verification code sent";
    }

    public String confirmEmailChange(ConfirmEmailRequest request) {

        VerificationToken token =
                tokenRepository.findByToken(request.getCode())
                        .orElseThrow(() ->
                                new RuntimeException("Invalid code"));

        if (token.isExpired()) {
            tokenRepository.delete(token);
            throw new RuntimeException("Code expired");
        }

        User user = token.getUser();
        user.setVerified(true);

        userRepository.save(user);
        tokenRepository.delete(token);

        return "Email changed successfully";
    }
}