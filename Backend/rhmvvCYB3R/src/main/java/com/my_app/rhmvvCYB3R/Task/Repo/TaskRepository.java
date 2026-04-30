package com.my_app.rhmvvCYB3R.Task.Repo;

import com.my_app.rhmvvCYB3R.Task.Entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserEmail(String email);
}