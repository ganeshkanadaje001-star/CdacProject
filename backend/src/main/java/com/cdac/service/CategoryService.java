package com.cdac.service;

import java.util.List;

import com.cdac.dto.CategoryReqDto;
import com.cdac.dto.CategoryResDto;

public interface CategoryService {
CategoryResDto addCategory(CategoryReqDto catReq,Long userId);
List<CategoryResDto> listCategories();
String deleteCategory(Long catId, Long userId);
CategoryResDto modifyCategory(Long catId, CategoryReqDto catReq, Long userId);
}
