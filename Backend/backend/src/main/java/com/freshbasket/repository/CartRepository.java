package com.freshbasket.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.freshbasket.entity.Cart;
import com.freshbasket.entity.User;

import java.util.List;
import java.util.Optional;


public interface CartRepository extends JpaRepository<Cart, Long> {
Optional<Cart>  findByUserId(Long userId);

}