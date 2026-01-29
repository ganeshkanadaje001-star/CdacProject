package com.cdac.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cdac.custom_exception.AccessDeniedException;
import com.cdac.custom_exception.ResourseNotFoundException;
import com.cdac.dto.ProductReqDto;
import com.cdac.dto.ProductResDto;
import com.cdac.entity.Category;
import com.cdac.entity.Products;
import com.cdac.entity.Role;
import com.cdac.entity.User;
import com.cdac.repository.CategoryRepository;
import com.cdac.repository.ProductRepository;
import com.cdac.repository.UserReopsitory;
import com.cdac.security.SecurityUtil;

import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class ProductServiceImpl implements ProductService {

	private final ProductRepository prodRepo;
	private final UserReopsitory userRepo;
	private final CategoryRepository catRepo;
	private final SecurityUtil securityUtil;
	private final ModelMapper model;
	
	private ProductResDto mapToResDto(Products product) {
	  
	    ProductResDto dto = model.map(product, ProductResDto.class);
	    
	    dto.setId(product.getId());
	    dto.setCategoryId(product.getCategory().getId());
	    dto.setCategoryName(product.getCategory().getName());
	    
	    return dto;
	}
	
	
	
	@Override
	public ProductResDto addProduct(ProductReqDto prodReq) {
//		Long userId=securityUtil.getCurrentUserId();
//		User user=userRepo.findById(userId).orElseThrow(()->new ResourseNotFoundException("User does not exists "));
////		if(user.getRole()!=Role.FARMER) {
////			throw new RuntimeException("Access Denied: Only Farmer can add products!");
////		}
		Category cat= catRepo.findById(prodReq.getCategoryId()).orElseThrow(()->new ResourseNotFoundException("Category does not exists "));
		Products prod=new Products();
		prod.setName(prodReq.getName());
		prod.setDescription(prodReq.getDescription());
		prod.setPrice(prodReq.getPrice());
		prod.setStock(prodReq.getStock());
		prod.setImageUrl(prodReq.getImageUrl());
		prod.setIsActive(prodReq.getIsActive());
		prod.setCategory(cat);
		//prod.setUserfarmer(user);
		Products savedProd = prodRepo.save(prod);
		
		ProductResDto resDto= model.map(savedProd, ProductResDto.class);
		resDto.setId(savedProd.getId());
		resDto.setCategoryName(cat.getName());
		resDto.setCategoryId(cat.getId());
		return resDto;
	}
	@Override
	public List<ProductResDto> allProducts() {
		List<Products> prod=prodRepo.findAll();
		return prod.stream()
	            .map(this::mapToResDto) 
	            .collect(Collectors.toList());
	}

	@Override
	public ProductResDto findId(Long prodId) {
		Products prod=prodRepo.findById(prodId).orElseThrow(()->new ResourseNotFoundException("Product Not Found"));
		ProductResDto proDto= model.map(prod,ProductResDto.class);
		proDto.setId(prodId);
		proDto.setCategoryId(prod.getCategory().getId());
		proDto.setCategoryName(prod.getCategory().getName());
		return proDto;
	}

	@Override
	public List<ProductResDto> findName(String prodName) {
		List<Products> prodList=prodRepo.findByName(prodName);
		
			return prodList.stream()
	            .map(this::mapToResDto) 
	            .collect(Collectors.toList());
	}




	@Override
	public String deleteProduct(Long productId) {

		    //  Get current userId from JWT
		    Long userId = securityUtil.getCurrentUserId();

		    //  Load user
		    User user = userRepo.findById(userId)
		            .orElseThrow(() ->
		                    new ResourseNotFoundException("User not found"));

		    //  Check ADMIN role ONLY
		    if (user.getRole() != Role.ADMIN) {
		        throw new AccessDeniedException(
		                "Access Denied: Only ADMIN can delete products");
		    }

		    //  Load product
		    Products product = prodRepo.findById(productId)
		            .orElseThrow(() ->
		                    new ResourseNotFoundException("Product not found"));

		   //Delete product
		    prodRepo.delete(product);

		    return "Product deleted successfully";
		}

	




	@Override
	public ProductResDto updateProductService(ProductReqDto reqDto,Long productId) {

	    //  Get current userId from JWT
	    Long currentUserId = securityUtil.getCurrentUserId();

	    //  Load user
	    User user = userRepo.findById(currentUserId)
	            .orElseThrow(() ->
	                    new ResourseNotFoundException("User not found"));

	    //  ADMIN CHECK ONLY
	    if (user.getRole() != Role.ADMIN) {
	        throw new AccessDeniedException(
	                "Access Denied: Only ADMIN can update products");
	    }

	    //  Fetch product
	    Products product = prodRepo.findById(productId)
	            .orElseThrow(() ->
	                    new ResourseNotFoundException(
	                            "Product not found with ID: " + productId));

	    //  Update fields
	    product.setName(reqDto.getName());
	    product.setDescription(reqDto.getDescription());
	    product.setPrice(reqDto.getPrice());
	    product.setStock(reqDto.getStock());
	    product.setImageUrl(reqDto.getImageUrl());
	    product.setIsActive(reqDto.getIsActive());

	    //  Update category if changed
	    if (reqDto.getCategoryId() != null && !product.getCategory().getId().equals(reqDto.getCategoryId())) {
	        Category newCategory = catRepo.findById(reqDto.getCategoryId())
	                .orElseThrow(() ->new ResourseNotFoundException("Category not found"));

	        product.setCategory(newCategory);
	    }

	    //  Save & return
	    Products updatedProduct = prodRepo.save(product);
	    return mapToResDto(updatedProduct);
	}



	@Override
	public List<ProductResDto> filterByCategory(Long catId) {
		List<Products> products=prodRepo.findByCategory_Id(catId);
		return products.stream()
	            .map(this::mapToResDto) 
	            .collect(Collectors.toList());
	}




//	@Override
//	public List<ProductResDto> filterByFarmer(Long farmerId) {
//		List<Products> products=prodRepo.findByUserfarmer_Id(farmerId);
//		return products.stream()
//	            .map(this::mapToResDto) 
//	            .collect(Collectors.toList());
//	}
	
}
