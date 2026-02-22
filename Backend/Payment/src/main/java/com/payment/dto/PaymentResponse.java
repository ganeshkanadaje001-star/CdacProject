package com.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PaymentResponse {
    private String razorpayOrderId;
    private Long amount;
    private String currency;
}
