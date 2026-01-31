package com.freshbasket.dto;

import com.freshbasket.entity.Products;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CartItemRequestDto {
	 
	   
	    @NotNull
	    private Integer quantity;

	   
	    private Double totalPrice; 

	    
	    private Products product;
}
