package com.freshbasket.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddressResDto {

    private Long id;

    private String addressLine;

    private String city;

    private String state;

    private String pincode;

    private String country;

    private boolean isDefault;
}

