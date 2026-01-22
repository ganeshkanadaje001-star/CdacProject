package com.cdac.service;

import com.cdac.dto.ExceptioResponse;
import com.cdac.dto.UserReqDto;
import com.cdac.dto.UserResDto;

public interface UserService {
UserResDto addUser(UserReqDto use);
 ExceptioResponse encryptPasswords();
}
