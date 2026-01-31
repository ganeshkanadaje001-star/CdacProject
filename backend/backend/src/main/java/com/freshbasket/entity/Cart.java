package com.freshbasket.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@Table(name = "cart")
@AttributeOverride(name = "id", column = @Column(name = "cart_id"))
public class Cart extends BaseEntity{

    private Double totalAmount = 0.0;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    // --- UNIDIRECTIONAL MAPPING ---
    // This defines that the foreign key 'cart_id' lives in the 'cart_items' table.
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "cart_id") 
    private List<CartItem> cartItems = new ArrayList<>();
    
    // You removed the helper methods, which is fine, 
    // but remember to handle total calculation in CartServiceImpl.
}