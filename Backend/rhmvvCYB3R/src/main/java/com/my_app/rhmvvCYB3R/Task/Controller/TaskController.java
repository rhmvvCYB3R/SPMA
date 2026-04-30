package com.my_app.rhmvvCYB3R.Task.Controller;

import com.my_app.rhmvvCYB3R.Task.Dto.CreateTaskRequest;
import com.my_app.rhmvvCYB3R.Task.Entity.Task;
import com.my_app.rhmvvCYB3R.Task.Service.TaskService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.PrintWriter;
import java.util.List;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // CREATE
    @PostMapping
    public Task create(@RequestBody CreateTaskRequest request,
                       Authentication auth) {
        return taskService.create(request, auth.getName());
    }

    // GET ALL
    @GetMapping
    public List<Task> getAll(Authentication auth) {
        return taskService.getAll(auth.getName());
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, Authentication auth) {
        taskService.deleteSecurely(id, auth.getName());
    }

    // DONE
    @PutMapping("/{id}/done")
    public Task done(@PathVariable Long id) {
        return taskService.markDone(id);
    }

    // CSV EXPORT (DONE TASKS ONLY)
    @GetMapping("/export")
    public void export(Authentication auth,
                       HttpServletResponse response) throws Exception {

        List<Task> tasks = taskService.getAllTasks(auth.getName());

        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=tasks.csv");

        PrintWriter writer = response.getWriter();
        writer.println("ID,Title,Description,DueDate,Status");

        for (Task t : tasks) {
            writer.println(
                    t.getId() + "," +
                            t.getTitle() + "," +
                            t.getDescription() + "," +
                            t.getDueDate() + "," +
                            t.getStatus()
            );
        }

        writer.flush();
        writer.close();
    }
}