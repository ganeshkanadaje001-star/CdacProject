package com.cdac.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CategoryReqDto {

    @NotBlank(message = "category name cannot be empty")
    private String name; 
    @NotBlank(message = "description cannot be empty")
    private String description;
}
