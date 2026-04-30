package com.my_app.rhmvvCYB3R.Task.Service;

import com.my_app.rhmvvCYB3R.Task.Dto.CreateTaskRequest;
import com.my_app.rhmvvCYB3R.Task.Entity.Task;
import com.my_app.rhmvvCYB3R.Task.Entity.TaskStatus;
import com.my_app.rhmvvCYB3R.Task.Repo.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // CREATE
    public Task create(CreateTaskRequest request, String email) {
        LocalDate date;
        if ("today".equalsIgnoreCase(request.getDueDate())) {
            date = LocalDate.now();
        } else {
            date = LocalDate.parse(request.getDueDate());
        }

        Task task = new Task(
                request.getTitle(),
                request.getDescription(),
                date,
                email
        );

        return taskRepository.save(task);
    }

    public void deleteSecurely(Long id, String email) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        // Проверяем, совпадает ли email владельца задачи с email из токена
        if (!task.getUserEmail().equals(email)) {
            throw new RuntimeException("You are not authorized to delete this task");
        }

        taskRepository.delete(task);
    }
    // GET ALL
    public List<Task> getAll(String email) {
        return taskRepository.findByUserEmail(email);
    }

    public void delete(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new RuntimeException("Task not found with id: " + id);
        }
        taskRepository.deleteById(id);
    }

    public Task markDone(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));


        if (task.getStatus() == TaskStatus.DONE) {
            task.setStatus(TaskStatus.PENDING);
        } else {
            task.setStatus(TaskStatus.DONE);
        }

        return taskRepository.save(task);
    }

    // NOT DONE AUTO LOGIC: Оптимизировано
    @Transactional
    public void updateOverdueTasks() {
        List<Task> allTasks = taskRepository.findAll();
        LocalDate today = LocalDate.now();

        List<Task> overdueTasks = allTasks.stream()
                .filter(task -> task.getStatus() != TaskStatus.DONE)
                .filter(task -> task.getStatus() != TaskStatus.NOT_DONE)
                .filter(task -> task.getDueDate().isBefore(today))
                .peek(task -> task.setStatus(TaskStatus.NOT_DONE))
                .collect(Collectors.toList());

        if (!overdueTasks.isEmpty()) {
            taskRepository.saveAll(overdueTasks);
        }
    }

    // All Progress EXPORT FILTER
    public List<Task> getAllTasks(String email) {
        return taskRepository.findByUserEmail(email);
    }
}