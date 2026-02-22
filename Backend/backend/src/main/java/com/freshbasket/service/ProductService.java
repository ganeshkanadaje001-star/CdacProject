package com.freshbasket.service;

import java.util.List;

import com.freshbasket.dto.ProductReqDto;
import com.freshbasket.dto.ProductResDto;

public interface ProductService {
	public ProductResDto addProduct(ProductReqDto prodReq);
	public List<ProductResDto> allProducts();
	public ProductResDto findId(Long prodId);
	public List<ProductResDto> findName(String prodName);
	public String deleteProduct(Long productId);
	public ProductResDto updateProductService(ProductReqDto prodReq,Long productId);
	public List<ProductResDto> filterByCategory(Long catId);
	//public List<ProductResDto> filterByFarmer(Long farmerId);
}