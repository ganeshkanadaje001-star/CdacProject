package com.cdac.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.Objects;

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
    private Long cartItemId; // Using your preferred name

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
    
    // NOTE: Because you used @JoinColumn(name="cart_id") in the Cart entity,
    // Hibernate will AUTOMATICALLY add a 'cart_id' column to this table 
    // in the database, even though you don't see it here in the Java class.

    // --- EQUALS & HASHCODE (MANDATORY for Set<CartItem>) ---
    // If you don't have this, your Set won't work properly.
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CartItem cartItem = (CartItem) o;
        return Objects.equals(cartItemId, cartItem.cartItemId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(cartItemId);
    }
}