package com.cdac.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cdac.entity.Products;


public interface ProductRepository extends JpaRepository<Products,Long>{
    List<Products> findByName(String name);
    List<Products> findByCategory_Id(Long category);
   // List<Products> findByUserfarmer_Id(Long farmerId);
}
