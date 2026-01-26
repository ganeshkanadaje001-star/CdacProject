package com.cdac.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.dto.OrderReqDto;
import com.cdac.service.OrderService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/order")
@AllArgsConstructor
public class OrderController {

	private final OrderService orderService;
	
	@PostMapping("/addOrder")
	public ResponseEntity<?> addOrders(@RequestBody @Valid OrderReqDto orderReqDto){
		return ResponseEntity.status(HttpStatus.CREATED).body(orderService.addOrder(orderReqDto));
	}
	
	@GetMapping("getMyOrder")
	public ResponseEntity<?> particularOrder(){
		return ResponseEntity.ok(orderService.getMyOrder());
	}
}
