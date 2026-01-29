package com.cdac.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.dto.AddressRequestDto;
import com.cdac.dto.AddressResponseDto;
import com.cdac.service.AddressService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/addresses") // Standardized plural naming convention
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @PostMapping("add")
    public ResponseEntity<AddressResponseDto> addNewAddress(@RequestBody @Valid AddressRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(addressService.createAddress(dto));
    }

    // Returns addresses belonging to the logged-in user
    @GetMapping("getAll")
    public ResponseEntity<List<AddressResponseDto>> getAll() {
        return ResponseEntity.ok(addressService.getAllAddresses());
    }

     //Fetches a specific address (logic inside service ensures it belongs to the user)
    @GetMapping("/{id}")
    public ResponseEntity<AddressResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(addressService.getAddressById(id));
    }

    // Only the owner (USER) should ideally delete their address
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        addressService.deleteAddress(id);
        return ResponseEntity.ok("Address deleted successfully");
    }
}