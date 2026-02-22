package com.freshbasket.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.freshbasket.dto.OrderReqDto;
import com.freshbasket.dto.OrderResDto;
import com.freshbasket.entity.OrderStatus;
import com.freshbasket.service.OrderService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/order")
@AllArgsConstructor
public class OrderController {

	private final OrderService orderService;

	@PostMapping("/addOrder")
	public ResponseEntity<?> addOrders(@RequestBody @Valid OrderReqDto orderReqDto) {
		return ResponseEntity.status(HttpStatus.CREATED).body(orderService.addOrder(orderReqDto));
	}

	@GetMapping("getMyOrder")
	public ResponseEntity<?> particularOrder() {
		return ResponseEntity.ok(orderService.getMyOrder());
	}

	@GetMapping("/all")
	public ResponseEntity<?> allOrders() {
		return ResponseEntity.ok(orderService.getAllOrders());
	}

	@PutMapping("/{orderId}/{paymentId}/paid")
	public ResponseEntity<?> markOrderAsPaid(@PathVariable Long orderId, @PathVariable String paymentId) {

		orderService.markOrderPaid(orderId, paymentId);

		return ResponseEntity.ok("Order marked as PAID successfully ✅");
	}

	@PutMapping("/{orderId}/status")
	public ResponseEntity<?> changeOrderStatus(@PathVariable Long orderId, @RequestParam OrderStatus status) {
		return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
	}
}
