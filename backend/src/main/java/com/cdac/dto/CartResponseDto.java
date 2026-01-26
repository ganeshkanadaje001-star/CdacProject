package com.cdac.dto;

import java.util.ArrayList;
import java.util.List;

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

    private List<CartItemResponseDto> cartItems = new ArrayList<>();
}
