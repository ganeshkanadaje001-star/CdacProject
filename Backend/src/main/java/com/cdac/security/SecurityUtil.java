package com.cdac.security;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.security.core.Authentication;
@Component
public class SecurityUtil {


	    public Long getCurrentUserId() {
	        Authentication auth =
	            SecurityContextHolder.getContext().getAuthentication();

	        if (auth == null || !auth.isAuthenticated()) {
	            throw new RuntimeException("Unauthenticated");
	        }

	        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
	        return Long.valueOf(principal.getUserId());
	    }
	}


