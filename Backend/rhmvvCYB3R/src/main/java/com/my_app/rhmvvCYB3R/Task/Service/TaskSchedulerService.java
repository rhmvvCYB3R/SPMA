package com.my_app.rhmvvCYB3R.Task.Service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class TaskSchedulerService {

    private final TaskService taskService;

    public TaskSchedulerService(TaskService taskService) {
        this.taskService = taskService;
    }

    @Scheduled(cron = "0 0 0 * * *")
    public void run() {
        taskService.updateOverdueTasks();
    }
}