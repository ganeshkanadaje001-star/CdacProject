package com.cdac.service;

import java.util.List;

import com.cdac.dto.CategoryReqDto;
import com.cdac.dto.CategoryResDto;

public interface CategoryService {
CategoryResDto addCategory(CategoryReqDto catReq);
List<CategoryResDto> listCategories();
String deleteCategory(Long catId);
CategoryResDto modifyCategory(Long catId, CategoryReqDto catReq);
}
