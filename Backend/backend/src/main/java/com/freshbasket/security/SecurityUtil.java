package com.freshbasket.security;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtil {

    @Autowired
    private HttpServletRequest request;

    public Long getCurrentUserId() {
        // Read the header you set in the API Gateway
        String userIdStr = request.getHeader("X-User-Id");

        if (userIdStr == null || userIdStr.isEmpty()) {
            throw new RuntimeException("Unauthorized: No User-Id found in request headers");
        }

        try {
            return Long.parseLong(userIdStr);
        } catch (NumberFormatException e) {
            throw new RuntimeException("Invalid User ID format in headers");
        }
    }
}