package com.cdac.service;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cdac.dto.UserReqDto;
import com.cdac.dto.UserResDto;
import com.cdac.entity.User;
import com.cdac.repository.UserReopsitory;

import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class UserServiceImpl implements UserService {
  private final UserReopsitory useRepo;
  private final ModelMapper model;
	@Override
	public UserResDto addUser(UserReqDto use) {
		User user=model.map(use, User.class);
		useRepo.save(user);
		return model.map(user, UserResDto.class);
	}

}
