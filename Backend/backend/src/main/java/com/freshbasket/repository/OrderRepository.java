package com.freshbasket.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.freshbasket.entity.Order;
import com.freshbasket.entity.User;


public interface OrderRepository extends JpaRepository<Order, Long> {
 List<Order> findByUser(User user);
}
