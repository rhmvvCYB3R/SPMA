package com.my_app.rhmvvCYB3R.Task.Entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    private TaskStatus status = TaskStatus.PENDING;

    private String userEmail;

    public Task() {}

    public Task(String title, String description, LocalDate dueDate, String userEmail) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.userEmail = userEmail;
        this.status = TaskStatus.PENDING;
    }

    // getters/setters

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }
}