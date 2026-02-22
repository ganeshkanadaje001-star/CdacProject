package com.cdac.dto;

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
    private Long productId;

    
    private String productName;
    private String imageUrl;

    private Integer quantity;
    private Double totalPrice;
}
