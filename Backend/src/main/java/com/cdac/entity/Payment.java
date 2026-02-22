package com.cdac.entity;

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
public class Payment extends BaseEntity{

    @Column(nullable = false)
    private Double amount;

    
    @Enumerated(EnumType.STRING)
    private PaymentStatus status; 

    @Enumerated(EnumType.STRING)
    private PaymentMethod method; 

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "payment_date")
    private Date paymentDate;
}
