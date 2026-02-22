package com.freshbasket.service;

import java.util.List;

import com.freshbasket.dto.CategoryReqDto;
import com.freshbasket.dto.CategoryResDto;

public interface CategoryService {
CategoryResDto addCategory(CategoryReqDto catReq);
List<CategoryResDto> listCategories();
String deleteCategory(Long catId);
CategoryResDto modifyCategory(Long catId, CategoryReqDto catReq);
}
