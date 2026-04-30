package com.my_app.rhmvvCYB3R.User.Repo;

import com.my_app.rhmvvCYB3R.User.Entity.VerificationToken;
import com.my_app.rhmvvCYB3R.User.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {

    Optional<VerificationToken> findByToken(String token);

    //for resend
    Optional<VerificationToken> findByUser(User user);

    void deleteByUser(User user);
}