package com.cdac.service;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cdac.custom_exception.ResourseNotFoundException;
import com.cdac.dto.ProductReqDto;
import com.cdac.dto.ProductResDto;
import com.cdac.entity.Products;
import com.cdac.entity.Role;
import com.cdac.entity.User;
import com.cdac.repository.ProductRepository;
import com.cdac.repository.UserReopsitory;

import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class ProductServiceImpl implements ProductService {

	private final ProductRepository prodRepo;
	private final UserReopsitory userRepo;
	private final ModelMapper model;
	
	public ProductResDto addProduct(ProductReqDto prodReq,Long userId) {
		User user=userRepo.findById(userId).orElseThrow(()->new ResourseNotFoundException("User does not exists "));
		if(user.getRole()!=Role.FARMER) {
			throw new RuntimeException("Access Denied: Only Farmer can add products!");
		}
		Products prod=model.map(prodReq, Products.class);
		prodRepo.save(prod);
		return model.map(prod, ProductResDto.class);
	}
}
