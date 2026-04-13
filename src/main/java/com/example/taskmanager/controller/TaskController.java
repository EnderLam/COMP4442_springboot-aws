package com.example.taskmanager.controller;

import com.example.taskmanager.dto.TaskRequest;
import com.example.taskmanager.dto.TaskResponse;
import com.example.taskmanager.security.UserPrincipal;
import com.example.taskmanager.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@SecurityRequirement(name = "bearerAuth")
public class TaskController {
    @Autowired
    private TaskService taskService;

    @GetMapping
    @Operation(summary = "Get all tasks for current user")
    public ResponseEntity<List<TaskResponse>> getMyTasks(@AuthenticationPrincipal UserPrincipal currentUser) {
        List<TaskResponse> tasks = taskService.getTasksByUserId(currentUser.getId());
        return ResponseEntity.ok(tasks);
    }

    @PostMapping
    @Operation(summary = "Create a new task")
    public ResponseEntity<TaskResponse> createTask(@AuthenticationPrincipal UserPrincipal currentUser,
                                                    @Valid @RequestBody TaskRequest request) {
        TaskResponse created = taskService.createTask(currentUser.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a task")
    public ResponseEntity<TaskResponse> updateTask(@AuthenticationPrincipal UserPrincipal currentUser,
                                                    @PathVariable Long id,
                                                    @Valid @RequestBody TaskRequest request) {
        TaskResponse updated = taskService.updateTask(currentUser.getId(), id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a task")
    public ResponseEntity<Void> deleteTask(@AuthenticationPrincipal UserPrincipal currentUser,
                                            @PathVariable Long id) {
        taskService.deleteTask(currentUser.getId(), id);
        return ResponseEntity.noContent().build();
    }
}