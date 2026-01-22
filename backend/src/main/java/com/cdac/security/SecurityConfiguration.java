package com.cdac.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Configuration // To declare a java configuration class (equivalent to bean config xml file)
@EnableWebSecurity // to enable spring security (in non reactive - servlet filter based)
@EnableMethodSecurity //  to add method level authorization rules(@PreAuthorize , @PostAuthorize)
@RequiredArgsConstructor
@Slf4j
public class SecurityConfiguration {
	// ctor based D.I
		private final CustomJwtVerificationFilter jwtFilter;

	/*
	 * Configure Spring sec filter chain as a spring bean (@Bean)
	 * to override the  spring sec defaults 
	 * Disable CSRF protection 
	 * Disable HttpSession 
	 * Disable login / logout page generation (i.e disable form login)
	 * Disable Basic Authentication scheme. 
	 * Add authorization rules 
	 *  - swagger , sign in , sign up , listing doctors
	 *    - public end points
	 *  - role based authorization 
	 *  - any other request 
	 *   - only authentication required 
	 * Add HttpSecurity as the dependency - to build sec filter chain
	 *  - HttpSecurity is a builder for building Spring security filter chain.
	 */
	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		log.info("********configuring spring sec filter chain*******");
		// disable CSRF protection - not needed in case of stateless REST APIs
		http.csrf(csrf -> csrf.disable());
		// disable HttpSession creation
		http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
		// add url based authentication n authorization rules
		http.authorizeHttpRequests(request ->
//configure public end points
		request.requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/User/signin", "/User/signup", "/User/pwd-encryption").permitAll()
		//in flight request from React front end
				.requestMatchers(HttpMethod.OPTIONS).permitAll()
				// ---------- PUBLIC READ APIs ----------
		        .requestMatchers(HttpMethod.GET, "/products/**").permitAll()
		        .requestMatchers(HttpMethod.GET, "/categories/**").permitAll()

		        // ---------- ADMIN WRITE APIs ----------
		        .requestMatchers(HttpMethod.POST, "/products/**").hasAuthority("ADMIN")
		        .requestMatchers(HttpMethod.PUT, "/products/**").hasAuthority("ADMIN")
		        .requestMatchers(HttpMethod.DELETE, "/products/**").hasAuthority("ADMIN")
		        .requestMatchers(HttpMethod.POST, "/categories/**").hasAuthority("ADMIN")
		        .requestMatchers(HttpMethod.PUT, "/categories/**").hasAuthority("ADMIN")
		        .requestMatchers(HttpMethod.DELETE, "/categories/**").hasAuthority("ADMIN")
		        .requestMatchers(HttpMethod.POST, "/cart/**").hasAuthority("CUSTOMER")
				.anyRequest().authenticated())
				//add custom jwt filter before 1st authentication filter -UsernamePasswordAuthenticationFilter
				.addFilterBefore(jwtFilter,UsernamePasswordAuthenticationFilter.class);
		return http.build();
	}

	// Configure AuthManager as spring bean - will be used by UserController (AuthController) - sign in - end point
	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}
	
	//configure PasswordEncoder as spring bean
	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
