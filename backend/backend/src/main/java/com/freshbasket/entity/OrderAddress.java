package com.freshbasket.entity;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderAddress {

    @Column(name = "address_line", length = 200, nullable = false)
    private String addressLine;

    @Column(name = "city", length = 50, nullable = false)
    private String city;

    @Column(name = "state", length = 50, nullable = false)
    private String state;

    @Column(name = "pincode", length = 10, nullable = false)
    private String pincode;

    @Column(name = "country", length = 50, nullable = false)
    private String country;
}
