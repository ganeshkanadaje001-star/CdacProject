package com.freshbasket.entity;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "category")
@AttributeOverride(name = "id", column = @Column(name = "category_id"))
@NoArgsConstructor
@AllArgsConstructor
public class Category extends BaseEntity{
    @NotBlank(message = "category name cannot be empty")
    private String name; 
    @NotBlank(message = "description cannot be empty")
    private String description;
}

