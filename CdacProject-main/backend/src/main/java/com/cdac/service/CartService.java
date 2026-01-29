package com.cdac.service;

import com.cdac.dto.CartRequestDto;
import com.cdac.dto.CartResponseDto;

public interface CartService {
public CartResponseDto addToCartService(CartRequestDto cartRequestDto);
CartResponseDto removeCartItem(Long productId);
void clearCart();
CartResponseDto updateCartItem(CartRequestDto dto);
CartResponseDto getMyCart();
}
