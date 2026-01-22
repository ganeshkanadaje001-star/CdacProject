package com.cdac.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "order_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date orderDate;

    @Column(name = "total_amount")
    private Double totalAmount;

    private OrderStatus status;

    // Unidirectional: Order knows User, but User doesn't know Order
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Products product;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "payment_id") 
    private Payment payment;
}