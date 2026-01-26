package com.cdac.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResDto {
	private Long productId;

	private Integer quantity;

	private double priceAtPurchase;

	private double subTotal;
}
