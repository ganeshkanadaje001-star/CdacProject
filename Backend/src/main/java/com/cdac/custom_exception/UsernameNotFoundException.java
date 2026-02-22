package com.cdac.custom_exception;

public class UsernameNotFoundException extends RuntimeException{
	public UsernameNotFoundException(String message) {
		super(message);
	}

}
