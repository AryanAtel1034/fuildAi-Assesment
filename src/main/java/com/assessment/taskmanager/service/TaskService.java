package com.assessment.taskmanager.service;

import com.assessment.taskmanager.model.Task;
import com.assessment.taskmanager.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository repository;

    public TaskService(TaskRepository repository) {
        this.repository = repository;
    }

    public List<Task> getAll() {
        return repository.findAll();
    }

    public Task create(String title) {
        return repository.save(new Task(title.trim()));
    }

    public Task update(Long id, String title, Boolean completed) {
        Task task = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (title != null && !title.isBlank()) {
            task.setTitle(title.trim());
        }
        if (completed != null) {
            task.setCompleted(completed);
        }
        return repository.save(task);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Task not found");
        }
        repository.deleteById(id);
    }
}
