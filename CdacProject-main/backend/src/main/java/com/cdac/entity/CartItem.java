package com.cdac.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.Objects;

@Entity
@Table(name = "cart_items")
@AttributeOverride(name = "id", column = @Column(name = "cartitem_id"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartItem extends BaseEntity{

    @NotNull
    private Integer quantity;

    // Optional but recommended: Store the total price for this line item
    // (e.g., 2 items * 50rs = 100rs)
    private Double totalPrice; 

    // --- REMOVED User user; ---
    // Why? The Cart already belongs to the User. 
    // The Item belongs to the Cart. 
    // Hierarchy: User -> Cart -> CartItem

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Products product;
    
}