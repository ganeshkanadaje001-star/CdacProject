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
import org.springframework.web.cors.CorsConfigurationSource;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
@Slf4j
public class SecurityConfiguration {

    private final CustomJwtVerificationFilter jwtFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        log.info("********configuring spring sec filter chain*******");

        http
            // ✅ enable CORS (non-deprecated way)
            .cors(cors -> cors.configurationSource(corsConfigurationSource))

            // ✅ disable CSRF (stateless API)
            .csrf(csrf -> csrf.disable())

            // ✅ stateless session
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // ✅ authorization rules
            .authorizeHttpRequests(request ->
                request
                    // public endpoints
                    .requestMatchers(
                        "/v3/api-docs/**",
                        "/swagger-ui/**",
                        "/User/signin",
                        "/User/SignUp",
                        "/User/pwd-encryption"
                    ).permitAll()

                    // preflight requests
                    .requestMatchers(HttpMethod.OPTIONS).permitAll()

                    // ---------- PUBLIC READ APIs ----------
                    .requestMatchers(HttpMethod.GET, "/products/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/categories/**").permitAll()

                    // ---------- ADMIN WRITE APIs ----------
                    .requestMatchers(HttpMethod.POST, "/products/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/products/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/products/**").hasRole("ADMIN")

                    .requestMatchers(HttpMethod.POST, "/categories/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/categories/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/categories/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.POST, "/media/**").hasRole("ADMIN")
                    
                    // Allow Admin to view all orders and create test orders
                    .requestMatchers(HttpMethod.GET, "/order/all").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.POST, "/order/addOrder").hasAnyRole("CUSTOMER", "ADMIN")

                    // ---------- CUSTOMER APIs ----------
                    .requestMatchers(HttpMethod.POST, "/cart/**").hasRole("CUSTOMER")
                    .requestMatchers(HttpMethod.POST, "/order/**").hasRole("CUSTOMER")

                    .anyRequest().authenticated()
            )

            // ✅ JWT filter
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
