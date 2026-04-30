package com.my_app.rhmvvCYB3R.User.Repo;

import com.my_app.rhmvvCYB3R.User.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    User findByCreatedAt (LocalDateTime createdAt);
    boolean existsByEmail(String email);
}