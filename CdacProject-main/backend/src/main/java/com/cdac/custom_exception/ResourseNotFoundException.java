package com.cdac.custom_exception;

public class ResourseNotFoundException extends RuntimeException {

	public ResourseNotFoundException(String message) {
		super(message);
	}

}
