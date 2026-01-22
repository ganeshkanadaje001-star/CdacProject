package com.cdac.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "products")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"category","userfarmer"})
public class Products {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long productId;
    @Column(name = "product_name")
    @NotNull
    private String name;
    @Column(name = "product_description")
    @NotNull
    private String description;
    @NotNull
    private Double price;
    
    private Integer stock;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @Column(name = "is_active")
    private Boolean isActive;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    
//    @ManyToOne
//    @JoinColumn(name = "farmer_id", nullable = false)
//    private User userfarmer;
}
