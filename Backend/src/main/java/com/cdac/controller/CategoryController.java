package com.cdac.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.dto.CategoryReqDto;
import com.cdac.service.CategoryService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/categories")
public class CategoryController {

	private final CategoryService catSer;
	
	@PostMapping("/add")
	public ResponseEntity<?> addCategory(@RequestBody @Valid CategoryReqDto catReq){
		
		return ResponseEntity.status(HttpStatus.CREATED).body(catSer.addCategory(catReq));
	}
	@GetMapping("/all")
public ResponseEntity<?> allCategory(){
		
		return ResponseEntity.ok(catSer.listCategories());
	}
	@DeleteMapping("/delete")
	public ResponseEntity<?> deleteCat(@RequestParam Long catId){
		return ResponseEntity.ok(catSer.deleteCategory(catId));
	}
	@PutMapping("/update/{catId}")
	public ResponseEntity<?> updateCat(@RequestBody @Valid CategoryReqDto catReq,@PathVariable Long catId){
		return ResponseEntity.ok(catSer.modifyCategory(catId,catReq));
	}
	

}
