package com.freshbasket.custom_exception;

public class UsernameNotFoundException extends RuntimeException{
	public UsernameNotFoundException(String message) {
		super(message);
	}

}
