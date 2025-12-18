package com.cdac.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "cart_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_item_id")
    private Long cartItemId;
    @NotNull
    private Integer quantity;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

   
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Products product;
}
