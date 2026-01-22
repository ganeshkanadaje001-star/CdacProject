package com.cdac.dto;

import java.util.HashSet;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CartResponseDto {

    private Long id;                
    private Double totalAmount = 0.0;

    private Set<CartItemResponseDto> cartItems = new HashSet<>();
}
