package com.cdac.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cdac.entity.Products;

public interface ProductRepository extends JpaRepository<Products,Long>{

}
