package com.cdac.dto;

import com.cdac.entity.Role;

import lombok.*;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserResDto {
	private Long id;
	
	private String firstName;

	private String lastName;
	
	private String email;

    private String phone;
    
	private Role role;
}
