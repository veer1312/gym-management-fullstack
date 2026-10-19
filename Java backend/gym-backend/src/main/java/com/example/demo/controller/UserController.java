package com.example.demo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.CreateMemberRequest;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.dto.MemberListResponse;
import com.example.demo.entity.User;
import com.example.demo.service.UserService;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // =====================================================
    // CREATE MEMBER
    // =====================================================

    @PostMapping("/create")
    public Map<String, Object> createMember(
            @Valid @RequestBody CreateMemberRequest request) {

        userService.createMember(request);

        Map<String, Object> response = new HashMap<>();

        response.put("success", true);
        response.put("message", "Member created successfully");

        return response;
    }

    // =====================================================
    // GET ALL USERS
    // =====================================================
    @GetMapping("/getAllUsers")
    public List<MemberListResponse> getUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String paymentStatus) {

        return userService.getAllUsers(
                search,
                status,
                paymentStatus,
                Pageable.unpaged()).getContent();
    }

    // =====================================================
    // GET USER BY ID
    // =====================================================

    @GetMapping("/getUserById/{id}")
    public User getUserById(
            @PathVariable Long id) {

        return userService.getUserById(id);
    }

    // =====================================================
    // UPDATE USER
    // =====================================================

    @PutMapping("/updateUser/{id}")
    public Map<String, Object> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody User user) {

        userService.updateUser(id, user);

        Map<String, Object> response = new HashMap<>();

        response.put("success", true);
        response.put("message", "User updated successfully");

        return response;
    }

    // =====================================================
    // DELETE USER
    // =====================================================

    @DeleteMapping("/deleteUser/{id}")
    public Map<String, Object> deleteUser(
            @PathVariable Long id) {

        userService.deleteUser(id);

        Map<String, Object> response = new HashMap<>();

        response.put("success", true);
        response.put("message", "User deleted successfully");

        return response;
    }

    // =====================================================
    // LOGIN
    // =====================================================

    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody LoginRequest loginRequest) {

        return userService.login(
                loginRequest.getEmail(),
                loginRequest.getPassword());
    }
}