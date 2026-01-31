package com.freshbasket.service;

import com.freshbasket.dto.CartRequestDto;
import com.freshbasket.dto.CartResponseDto;

public interface CartService {
public CartResponseDto addToCartService(CartRequestDto cartRequestDto);
CartResponseDto removeCartItem(Long productId);
void clearCart();
CartResponseDto updateCartItem(CartRequestDto dto);
CartResponseDto getMyCart();
}
