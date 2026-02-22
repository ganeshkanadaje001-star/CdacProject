package com.freshbasket.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "products")
@AttributeOverride(name = "id", column = @Column(name = "product_id"))
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"category"})
public class Products extends BaseEntity{

    
    
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
    
}
