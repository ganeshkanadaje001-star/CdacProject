package com.freshbasket.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@ToString
public class JwtDTO {
	private Long userId;
	private String email;
	private String role;

}

