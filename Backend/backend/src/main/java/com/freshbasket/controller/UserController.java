package com.freshbasket.controller;



import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.freshbasket.dto.LoginReqDto;
import com.freshbasket.dto.LoginResDto;
import com.freshbasket.dto.UserReqDto;
import com.freshbasket.security.JwtUtils;
import com.freshbasket.security.UserPrincipal;
import com.freshbasket.service.UserServiceImpl;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/User")
@Slf4j
@AllArgsConstructor
public class UserController {
	private final UserServiceImpl userSer;
	private final AuthenticationManager authenticationManager;
	private final JwtUtils jwtUtils;

	@PostMapping("/SignUp")
	public ResponseEntity<?> addUser(@RequestBody @Valid UserReqDto use) {
		return ResponseEntity.status(HttpStatus.CREATED).body(userSer.addUser(use));
	}
	@PatchMapping("/pwd-encryption")
	public ResponseEntity<?> encodePassword(){
		return ResponseEntity.ok(userSer.encryptPasswords());
	}
	@PostMapping("/signin")
	@Operation(description = "User Authentication With Spring Security")
	public ResponseEntity<?> userSignIn(@RequestBody @Valid  LoginReqDto request) {
		System.out.println("in user sign in "+request);		
		/*1. Create Authentication object (UsernamePasswordAuthToken) 
		 * to store - email & password
		 */
		Authentication holder=new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword());
		log.info("*****Before -  is authenticated {}",holder.isAuthenticated());//false
		/*
		 * Call AuthenticationMgr's authenticate method
		 */
		 Authentication fullyAuth = authenticationManager.authenticate(holder);
		//=> authentication success -> create JWT 
		log.info("*****After -  is authenticated {}",fullyAuth.isAuthenticated());//true
		log.info("**** auth {} ",fullyAuth);//principal : user details , null : pwd , Collection<GrantedAuth>		
		log.info("***** class of principal {}",fullyAuth.getPrincipal().getClass());//com.healthcare.security.UserPrincipal
		//downcast Object -> UserPrincipal
		UserPrincipal principal=(UserPrincipal) fullyAuth.getPrincipal();
			return ResponseEntity.ok(new LoginResDto(jwtUtils.generateToken(principal),"Successful Login"));		
	}
}
