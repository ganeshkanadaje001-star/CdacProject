package com.freshbasket.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.freshbasket.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {

	
}
