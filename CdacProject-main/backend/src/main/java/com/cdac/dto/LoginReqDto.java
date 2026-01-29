package com.cdac.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginReqDto {
	@NotBlank(message = "Email cannot be empty")
	@Email(message = "Invalid email format")
	private String email;
	@NotBlank(message = "Password cannot be empty")
	private String password;
}
