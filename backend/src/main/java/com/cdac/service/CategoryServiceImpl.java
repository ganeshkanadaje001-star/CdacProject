package com.cdac.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cdac.custom_exception.ResourseNotFoundException;
import com.cdac.dto.CategoryReqDto;
import com.cdac.dto.CategoryResDto;
import com.cdac.entity.Category;
import com.cdac.entity.Role;
import com.cdac.entity.User;
import com.cdac.repository.CategoryRepository;
import com.cdac.repository.UserReopsitory;

import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class CategoryServiceImpl implements CategoryService {

	private final ModelMapper model;
	private final CategoryRepository catRepo;
	private final UserReopsitory userRepo;

	@Override
	public CategoryResDto addCategory(CategoryReqDto catReq, Long userId) {
		User user = userRepo.findById(userId)
				.orElseThrow(() -> new ResourseNotFoundException("User is not for this id"));
		if (user.getRole() != Role.ADMIN) {
			throw new RuntimeException("Access Denied: Only Admins can add categories!");
		}
		Category cat = model.map(catReq, Category.class);
		catRepo.save(cat);

		return model.map(cat, CategoryResDto.class);

	}

	@Override
	public List<CategoryResDto> listCategories() {
		List<Category> categories=catRepo.findAll();
		
		return categories.stream()
	            .map(category -> model.map(category, CategoryResDto.class))
	            .toList();
	}
	@Override
	public String deleteCategory(Long catId, Long userId) {
		User user = userRepo.findById(userId)
				.orElseThrow(() -> new ResourseNotFoundException("User is not for this id"));
		if (user.getRole() != Role.ADMIN) {
			throw new RuntimeException("Access Denied: Only Admins can add categories!");
		}
		catRepo.deleteById(catId);

		return "Category is deleted";

	}
	@Override
	public CategoryResDto modifyCategory(Long catId, CategoryReqDto catReq, Long userId) {
		User user = userRepo.findById(userId)
				.orElseThrow(() -> new ResourseNotFoundException("User is not for this id"));
		if (user.getRole() != Role.ADMIN) {
			throw new RuntimeException("Access Denied: Only Admins can add categories!");
		}
		Category category=catRepo.findById(catId).orElseThrow(()->new ResourseNotFoundException("Category is not for this id"));
		
		model.map(catReq,category);
		
        catRepo.save(category);
		return model.map(category, CategoryResDto.class);

	}

}
