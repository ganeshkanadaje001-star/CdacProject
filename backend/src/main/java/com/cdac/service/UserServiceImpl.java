package com.cdac.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cdac.dto.ExceptioResponse;
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
  private final PasswordEncoder passwordEncoder;
	@Override
	public UserResDto addUser(UserReqDto use) {
		String encodedPasswor=passwordEncoder.encode(use.getPassword());
		User user=model.map(use, User.class);
		user.setPassword(encodedPasswor);
		useRepo.save(user);
		return model.map(user, UserResDto.class);
	}
	@Override
	public ExceptioResponse encryptPasswords() {
		//get all users
		List<User> users = useRepo.findAll();	
		//user - persistent
		users.forEach(user ->
		 user.setPassword(passwordEncoder.encode(user.getPassword())));
		return new ExceptioResponse("Password encrypted", "Success");
	}
	
}
