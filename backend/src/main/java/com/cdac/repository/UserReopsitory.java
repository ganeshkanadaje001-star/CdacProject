package com.cdac.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cdac.entity.User;


public interface UserReopsitory extends JpaRepository<User, Long> {
  Optional<User> findByEmail(String email);
}
