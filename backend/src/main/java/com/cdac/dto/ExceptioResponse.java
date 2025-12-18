package com.cdac.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class ExceptioResponse {
	private String message;
	private String status;
	private LocalDateTime date;

	public ExceptioResponse(String message, String status) {
		super();
		this.message = message;
		this.status = status;
		this.date = LocalDateTime.now();
	}

}
