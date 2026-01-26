package com.cdac.dto;

import java.util.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class OrderResDto {
	private Long orderId;

	private Date orderDate;

	private String status;

	private double totalAmount;

	private PaymentResDto payment;

	private List<OrderItemResDto> items;
}
