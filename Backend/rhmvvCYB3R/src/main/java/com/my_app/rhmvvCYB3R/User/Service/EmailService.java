package com.my_app.rhmvvCYB3R.User.Service;

import com.my_app.rhmvvCYB3R.User.Entity.User;
import com.my_app.rhmvvCYB3R.User.Entity.VerificationToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationEmail(User user, VerificationToken verificationToken) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Your verification code");
        message.setText("Your verification code: " + verificationToken.getToken() +
                "\nCode expires in 15 minutes.");
        mailSender.send(message);
    }
}