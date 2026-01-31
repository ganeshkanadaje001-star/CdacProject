package com.freshbasket.custom_exception;

public class ResourceAlreadyExists extends RuntimeException {
 public ResourceAlreadyExists(String message) {
	 super(message);
 }
}
