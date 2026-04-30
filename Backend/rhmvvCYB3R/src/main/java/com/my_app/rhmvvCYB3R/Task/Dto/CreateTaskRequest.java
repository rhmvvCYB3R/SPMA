package com.my_app.rhmvvCYB3R.Task.Dto;

public class CreateTaskRequest {

    private String title;
    private String description;
    private String dueDate; // "2026-03-02" or "today"

    public CreateTaskRequest() {}

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getDueDate() {
        return dueDate;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }
}