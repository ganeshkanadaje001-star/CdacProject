package com.cdac.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cdac.entity.Address;

public interface AddressRepository extends JpaRepository<Address, Long> {
	
}
