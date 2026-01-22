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
@Component // spring bean
@RequiredArgsConstructor
public class CustomJwtVerificationFilter extends OncePerRequestFilter {
	private final JwtUtils jwtUtils;
	private final ObjectMapper objectMapper;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		try {
			// 1. Check for Authorization header in the incoming request -> get its value
			String authHeader = request.getHeader("Authorization");
			if (authHeader != null && authHeader.startsWith("Bearer ")) {
				log.info("**** Bearer Token found ");
				//extracting JWT from authorization header
				String jwt = authHeader.substring(7);
				// 2. validate token
				Claims claims = jwtUtils.validateToken(jwt);
				// 3. Create authentication object - user id & user role -
				// extract the claims
				String userId = claims.get("user_id", String.class);
				String role = claims.get("user_role", String.class);
				List<SimpleGrantedAuthority> grantedAuthorities = List.of(new SimpleGrantedAuthority(role));
				// 4. add these details UserPrincipal
				UserPrincipal principal = new UserPrincipal(userId, claims.getSubject(), null, null, role);
				Authentication authentication = new UsernamePasswordAuthenticationToken(principal, null,
						grantedAuthorities);
				log.info("*******auth {}",authentication);
				// 5. store Authentication object under spring security context
				SecurityContextHolder.getContext().setAuthentication(authentication);
				log.info("**** store auth under sec ctx");
			}
			// delegate request handling to the next filter in the chain
			filterChain.doFilter(request, response);
		} catch (Exception e) {
			log.error("Invalid JWT {} ",e);
//			e.printStackTrace();
			SecurityContextHolder.clearContext();// important
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);//SC 401
			response.setContentType("application/json");
			ExceptioResponse resp=new ExceptioResponse("Failed", e.getMessage());
			response.getWriter().write(objectMapper.writeValueAsString(resp));
			return;
		}

	}

}
