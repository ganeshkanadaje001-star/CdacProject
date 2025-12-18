package com.cdac.dto;

import com.cdac.entity.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
@Setter
@Getter

public class UserReqDto {
	@NotBlank(message="Name Cannot be blank")
	private String firstName;
	@NotBlank(message="LastName Cannot be blank")
	private String lastName;
	@Email(message = "Invalid email format")
	private String email;
	@NotBlank
	private String password;
	@Pattern(regexp = "^\\d{10}$", message = "Phone number must be exactly 10 digits")
    private String phone;

	private Role role;
}
