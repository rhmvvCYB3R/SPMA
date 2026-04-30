package com.my_app.rhmvvCYB3R.User.Controller;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import com.my_app.rhmvvCYB3R.User.Dto.*;
import com.my_app.rhmvvCYB3R.User.Service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    @Autowired
    private UserProfileService userProfileService;

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        return ResponseEntity.ok(userProfileService.getCurrentUser());
    }

    @PutMapping("/password")
    public ResponseEntity<MessageResponse> changePassword(
            @RequestBody ChangePasswordRequest request
    ) {
        return ResponseEntity.ok(
                new MessageResponse(
                        userProfileService.changePassword(request)
                )
        );
    }

    @PutMapping("/email/request")
    public ResponseEntity<MessageResponse> requestEmailChange(
            @RequestBody ChangeEmailRequest request
    ) {
        return ResponseEntity.ok(
                new MessageResponse(
                        userProfileService.requestEmailChange(request)
                )
        );
    }

    @PutMapping("/email/confirm")
    public ResponseEntity<MessageResponse> confirmEmailChange(
            @RequestBody ConfirmEmailRequest request
    ) {
        return ResponseEntity.ok(
                new MessageResponse(
                        userProfileService.confirmEmailChange(request)
                )
        );
    }
}