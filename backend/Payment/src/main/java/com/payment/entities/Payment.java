package com.payment.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Table(name = "payments")
@AttributeOverride(name = "id", column = @Column(name = "payment_id"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment extends BaseEntity {

    // 🔗 Order Service reference
    @Column(name = "order_id", nullable = false)
    private Long orderId;

    // 💰 Amount in paise (IMPORTANT for Razorpay)
    @Column(nullable = false)
    private Long amount;

    @Column(nullable = false)
    private String currency; // INR

    // Razorpay identifiers
    @Column(name = "razorpay_order_id", unique = true)
    private String razorpayOrderId;

    @Column(name = "razorpay_payment_id", unique = true)
    private String razorpayPaymentId;

    @Column(name = "razorpay_signature")
    private String razorpaySignature;

    // Payment status
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

    // CARD / UPI / NETBANKING / WALLET
    @Enumerated(EnumType.STRING)
    private PaymentMethod method;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "payment_date")
    private Date paymentDate;
}
