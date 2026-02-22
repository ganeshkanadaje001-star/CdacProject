package com.cdac.service;

import com.cdac.dto.AddressRequestDto;
import com.cdac.dto.AddressResponseDto;
import java.util.List;

public interface AddressService {
    AddressResponseDto createAddress(AddressRequestDto dto);
    List<AddressResponseDto> getAllAddresses();
    AddressResponseDto getAddressById(Long addressId);
    void deleteAddress(Long id);
}