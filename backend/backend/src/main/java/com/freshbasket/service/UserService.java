package com.freshbasket.service;

import com.freshbasket.dto.ExceptioResponse;
import com.freshbasket.dto.UserReqDto;
import com.freshbasket.dto.UserResDto;

public interface UserService {
UserResDto addUser(UserReqDto use);
 ExceptioResponse encryptPasswords();
}
