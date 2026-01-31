package com.freshbasket.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CartItemResponseDto {

    private Long cartItemId;
    private Integer quantity;
    private Double totalPrice;
    private Long productId;
}
