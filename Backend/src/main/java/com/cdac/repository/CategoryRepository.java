package com.cdac.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.cdac.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {

	
}
