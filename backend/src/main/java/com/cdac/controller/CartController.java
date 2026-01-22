package com.cdac.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.dto.CartRequestDto;
import com.cdac.service.CartService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {
	public final CartService cartService;

	@PostMapping("AddCart")
	public ResponseEntity<?> addToCart(@RequestBody @Valid CartRequestDto cartRequestDto) {
		return ResponseEntity.status(HttpStatus.CREATED).body(cartService.addToCartService(cartRequestDto));
	}

	@PutMapping("/update")
	public ResponseEntity<?> updateCartItem(@RequestBody @Valid CartRequestDto cartRequestDto) {

		return ResponseEntity.ok(cartService.updateCartItem(cartRequestDto));

	}
	@DeleteMapping("/remove/{productId}")
	public ResponseEntity<?> removeCartItem(@PathVariable Long productId) {

		return ResponseEntity.ok(cartService.removeCartItem(productId));
	}

	@DeleteMapping("/clear")
	public ResponseEntity<Void> clearCart() {

		cartService.clearCart();
		return ResponseEntity.noContent().build();
	}
}