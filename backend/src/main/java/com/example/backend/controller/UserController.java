package com.example.backend.controller;

import com.example.backend.dto.RegisterRequest;
import com.example.backend.dto.LoginRequest;
import com.example.backend.model.User;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody RegisterRequest request) {
        System.out.println("Received registration request: " + request);
        User registeredUser = userService.registerUser(request);
        System.out.println("User registered successfully: " + registeredUser);
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/signin")
    public ResponseEntity<User> signinUser(@RequestBody LoginRequest request) {
        System.out.println("Received signin request: " + request);
        User signedInUser = userService.signinUser(request);
        System.out.println("User signed in successfully: " + signedInUser);
        return ResponseEntity.ok(signedInUser);
    }
}