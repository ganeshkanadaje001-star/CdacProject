package com.freshbasket.service;

import java.util.List;

import com.freshbasket.dto.AddressRequestDto;
import com.freshbasket.dto.AddressResponseDto;

public interface AddressService {
    AddressResponseDto createAddress(AddressRequestDto dto);
    List<AddressResponseDto> getAllAddresses();
    AddressResponseDto getAddressById(Long addressId);
    void deleteAddress(Long id);
}