package com.cdac.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cdac.entity.Order;
import com.cdac.entity.User;


public interface OrderRepository extends JpaRepository<Order, Long> {
 List<Order> findByUser(User user);
}
