package com.cdac.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cdac.entity.User;

public interface UserReopsitory extends JpaRepository<User, Long> {

}
