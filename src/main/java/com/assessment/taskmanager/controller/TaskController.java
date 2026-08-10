package com.assessment.taskmanager.controller;

import com.assessment.taskmanager.model.Task;
import com.assessment.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService service;

    public TaskController(TaskService service) {
        this.service = service;
    }

    @GetMapping
    public List<Task> getTasks() {
        return service.getAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Task create(@Valid @RequestBody CreateTaskRequest request) {
        return service.create(request.title());
    }

    @PutMapping("/{id}")
    public Task update(@PathVariable Long id, @RequestBody UpdateTaskRequest request) {
        return service.update(id, request.title(), request.completed());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    public record CreateTaskRequest(@NotBlank String title) {}
    public record UpdateTaskRequest(String title, Boolean completed) {}
}
