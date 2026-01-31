package com.freshbasket.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResDto {

    private Long paymentId;
    private String paymentMode;
    private String paymentStatus;
}
