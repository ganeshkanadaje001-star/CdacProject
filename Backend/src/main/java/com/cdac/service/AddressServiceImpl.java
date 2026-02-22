package com.cdac.service;

import com.cdac.dto.AddressRequestDto;
import com.cdac.dto.AddressResponseDto;
import com.cdac.entity.Address;
import com.cdac.entity.User;
import com.cdac.repository.AddressRepository;
import com.cdac.repository.UserReopsitory;
import com.cdac.security.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final UserReopsitory userRepository;
    private final AddressRepository addressRepository;
    private final SecurityUtil securityUtil;
    private final ModelMapper mapper;

    @Override
    public AddressResponseDto createAddress(AddressRequestDto dto) {
        Long userId = securityUtil.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Address newAddress = mapper.map(dto, Address.class);

        // Logic: If this is the first address or set as default, 
        // handle existing default addresses.
        handleDefaultAddress(user, newAddress);

        user.getAddresses().add(newAddress);
        // Saving the user will save the address due to CascadeType.ALL
        userRepository.save(user); 

        return mapper.map(newAddress, AddressResponseDto.class);
    }

    @Override
    public List<AddressResponseDto> getAllAddresses() {
        Long userId = securityUtil.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Just return the list already present in the User entity
        return user.getAddresses().stream()
                .map(addr -> mapper.map(addr, AddressResponseDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public void deleteAddress(Long addressId) {
        Long userId = securityUtil.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Remove address from user's list (orphanRemoval will delete it from DB)
        boolean removed = user.getAddresses().removeIf(addr -> addr.getId().equals(addressId));
        
        if (!removed) {
            throw new RuntimeException("Address not found or unauthorized");
        }
    }
    @Override
    public AddressResponseDto getAddressById(Long addressId) {
        Long currentUserId = securityUtil.getCurrentUserId();
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Logic: Find the address in the user's own list
        Address address = user.getAddresses().stream()
                .filter(a -> a.getId().equals(addressId))
                .findFirst()
                .orElse(null);

        // If not found in user's list, check if the requester is an ADMIN
        if (address == null) {
            if (user.getRole().name().equals("ROLE_ADMIN")) {
                // Admin can look up any address directly via repository if needed
                return addressRepository.findById(addressId)
                        .map(addr -> mapper.map(addr, AddressResponseDto.class))
                        .orElseThrow(() -> new RuntimeException("Address not found"));
            }
            throw new RuntimeException("Access Denied: You do not own this address");
        }

        return mapper.map(address, AddressResponseDto.class);
    }
    private void handleDefaultAddress(User user, Address newAddress) {
        if (newAddress.isDefault()) {
            // Unset 'isDefault' for all existing addresses of this user
            user.getAddresses().forEach(addr -> addr.setDefault(false));
        } else if (user.getAddresses().isEmpty()) {
            // If it's the first address, make it default anyway
            newAddress.setDefault(true);
        }
    }
}