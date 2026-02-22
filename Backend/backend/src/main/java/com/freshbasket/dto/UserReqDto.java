package com.freshbasket.dto;

import com.freshbasket.entity.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter

public class UserReqDto {
	@NotBlank(message = "Name Cannot be blank")
	private String firstName;
	@NotBlank(message = "LastName Cannot be blank")
	private String lastName;
	@Email(message = "Invalid email format")
	private String email;
	@NotBlank(message="Password cannot be empty")
	private String password;
	@NotBlank(message = "Phone number is required")
	@Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid mobile number")
	private String phone;

	private Role role;
}
