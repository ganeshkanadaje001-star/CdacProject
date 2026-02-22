package com.cdac.security;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.cdac.dto.ExceptioResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class CustomJwtVerificationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // 🔥 1. ALLOW CORS PREFLIGHT REQUESTS
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // 2. Read Authorization header
            String authHeader = request.getHeader("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                log.info("**** Bearer Token found");

                // 3. Extract token
                String jwt = authHeader.substring(7);

                // 4. Validate token
                Claims claims = jwtUtils.validateToken(jwt);

                // 5. Extract claims
                String userId = claims.get("user_id", String.class);
                String role = claims.get("user_role", String.class);

                // 🔥 6. PREFIX ROLE FOR SPRING SECURITY
                SimpleGrantedAuthority authority =
                        new SimpleGrantedAuthority("ROLE_" + role);

                // 7. Create principal
                UserPrincipal principal =
                        new UserPrincipal(
                                userId,
                                claims.getSubject(),
                                null,
                                null,
                                role
                        );

                // 8. Create authentication
                Authentication authentication =
                        new UsernamePasswordAuthenticationToken(
                                principal,
                                null,
                                List.of(authority)
                        );

                log.info("Authenticated user={}, role={}", userId, role);

                // 9. Store authentication
                SecurityContextHolder.getContext()
                        .setAuthentication(authentication);
            }

            // 10. Continue filter chain
            filterChain.doFilter(request, response);

        } catch (Exception e) {
            log.error("Invalid JWT", e);

            SecurityContextHolder.clearContext();

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");

            ExceptioResponse resp =
                    new ExceptioResponse("Failed", e.getMessage());

            response.getWriter()
                    .write(objectMapper.writeValueAsString(resp));
        }
    }
}
