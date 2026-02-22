package com.cdac.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductReqDto {
    
    @NotBlank(message = "Product name is required")
    private String name;
    
    private String description;
    
    @Min(value = 0, message = "Price cannot be negative")
    private double price;
    
    @Min(value = 0, message = "Stock must be zero or more")
    private int stock;
    
  
    private String imageUrl;
    
    @NotNull(message = "Active stauts should be given")
    private Boolean isActive;
    
    @NotNull(message = "Category ID is mandatory")
    private Long categoryId; 
    
}
