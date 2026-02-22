package com.freshbasket.global_exception;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.freshbasket.controller.CategoryController;
import com.freshbasket.custom_exception.AccessDeniedException;
import com.freshbasket.custom_exception.ResourseNotFoundException;
import com.freshbasket.custom_exception.UsernameNotFoundException;
import com.freshbasket.dto.ExceptioResponse;

@RestControllerAdvice
public class GlobalException {

    private final CategoryController categoryController;

    GlobalException(CategoryController categoryController) {
        this.categoryController = categoryController;
    }

	@ExceptionHandler(ResourseNotFoundException.class)
	public ResponseEntity<?> handleResourseNotFoundException(ResourseNotFoundException e){
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ExceptioResponse(e.getMessage(), "Failed"));
	}
	@ExceptionHandler(RuntimeException.class)
	public ResponseEntity<?> handleRuntimeException(RuntimeException r){
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ExceptioResponse(r.getMessage(), "Failed"));
	}
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<?> handleRuntimeException(MethodArgumentNotValidException m){
		List<FieldError> fieldErrors = m.getFieldErrors();
		Map<String, String> errorFieldMap = fieldErrors.stream() 
		.collect(Collectors.toMap(FieldError::getField,FieldError::getDefaultMessage));
		
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorFieldMap);
	}
	@ExceptionHandler(UsernameNotFoundException.class)
	public ResponseEntity<?> handleUsernameNotFoundException(RuntimeException r){
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ExceptioResponse(r.getMessage(), "Failed"));
	}
	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<?> handleAccessDeniedException(RuntimeException r){
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ExceptioResponse(r.getMessage(), "Failed"));
	}
}
