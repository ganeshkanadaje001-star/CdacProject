package com.cdac.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.dto.ProductReqDto;
import com.cdac.dto.ProductResDto;
import com.cdac.service.ProductService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/products")
@AllArgsConstructor
public class ProductController {
	private final ProductService prodService;

	@PostMapping("/add")
	//@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> addProducts(@RequestBody @Valid ProductReqDto prodReq) {
		return ResponseEntity.ok(prodService.addProduct(prodReq));
	}

	@GetMapping("/all")
	public ResponseEntity<?> allProducts() {
		return ResponseEntity.ok(prodService.allProducts());
	}

	@GetMapping("byId/{prodId}")
	public ResponseEntity<?> productsById(@PathVariable Long prodId) {
		return ResponseEntity.ok(prodService.findId(prodId));
	}

	@GetMapping("byName/")
	public ResponseEntity<?> productsByName(@RequestParam(value = "keyword", required = false) String prodName) {
		return ResponseEntity.ok(prodService.findName(prodName));
	}

	@DeleteMapping("delete/{prodId}")
	public ResponseEntity<?> delete(@PathVariable Long prodId) {
		return ResponseEntity.ok(prodService.deleteProduct(prodId));
	}

	@PutMapping("/update/{productId}")
	public ResponseEntity<?> updateProduct(@PathVariable Long productId,
			@RequestBody @Valid ProductReqDto reqDto) {
		// Call the service and return the updated result
		ProductResDto updatedProduct = prodService.updateProductService(reqDto, productId);
		return ResponseEntity.ok(updatedProduct);
	}

	@GetMapping("/byCategoryId/{catID}")
	public ResponseEntity<?> getByCategory(@RequestParam Long catId) {

		return ResponseEntity.ok(prodService.filterByCategory(catId));
	}
//	@GetMapping("/byFamrmerId/{famID}")
//	public ResponseEntity<?> getByFarmerID(@RequestParam Long farmerId) {
//
//		return ResponseEntity.ok(prodService.filterByFarmer(farmerId));
//	}

}
