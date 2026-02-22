package com.freshbasket.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.freshbasket.entity.Address;

public interface AddressRepository extends JpaRepository<Address, Long> {
	
}
