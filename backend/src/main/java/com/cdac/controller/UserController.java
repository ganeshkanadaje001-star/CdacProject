package com.cdac.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.dto.UserReqDto;
import com.cdac.service.UserServiceImpl;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/User")
@AllArgsConstructor
public class UserController {
	private final UserServiceImpl userSer;

	@PostMapping("/add")
	public ResponseEntity<?> addUser(@RequestBody @Valid UserReqDto use) {
		return ResponseEntity.status(HttpStatus.CREATED).body(userSer.addUser(use));
	}
}
