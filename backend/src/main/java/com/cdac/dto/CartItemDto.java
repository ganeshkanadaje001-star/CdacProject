package com.cdac.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartItemDto {

    private Long cartItemId;
    private Long productId;
    private String productName;
    private String imageUrl;
    private Integer quantity;
    private Double totalPrice;
}
