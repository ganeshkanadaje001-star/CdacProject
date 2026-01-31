package com.freshbasket.api_gateway.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.reactive.CorsConfigurationSource;

import lombok.RequiredArgsConstructor;
@Configuration 
@EnableWebFluxSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final CustomJwtVerificationFilter jwtFilter;
    private final CorsConfigurationSource corsConfigurationSource;

@Bean
    SecurityWebFilterChain securityWebFilterChain(
            ServerHttpSecurity http){

   

       return 
    		   http.csrf(ServerHttpSecurity.CsrfSpec::disable)
            // ✅ enable CORS (non-deprecated way)
            .cors(cors -> cors.configurationSource(corsConfigurationSource))

            // ✅ disable CSRF (stateless API)
            .csrf(csrf -> csrf.disable())

            .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
            // ✅ authorization rules
            .authorizeExchange(auth->auth
                    // public endpoints
                    .pathMatchers(
                        "/v3/api-docs/**",
                        "/swagger-ui/**",
                        "/User/signin",
                        "/User/SignUp",
                        "/User/pwd-encryption"
                    ).permitAll()

                    // preflight requests
                    .pathMatchers (HttpMethod.OPTIONS).permitAll()

                    // ---------- PUBLIC READ APIs ----------
                    .pathMatchers(HttpMethod.GET, "/products/**").permitAll()
                    .pathMatchers(HttpMethod.GET, "/categories/**").permitAll()

                    // ---------- ADMIN WRITE APIs ----------
                    .pathMatchers(HttpMethod.POST, "/products/**").hasRole("ADMIN")
                    .pathMatchers(HttpMethod.PUT, "/products/**").hasRole("ADMIN")
                    .pathMatchers(HttpMethod.DELETE, "/products/**").hasRole("ADMIN")

                    .pathMatchers(HttpMethod.POST, "/categories/**").hasRole("ADMIN")
                    .pathMatchers(HttpMethod.PUT, "/categories/**").hasRole("ADMIN")
                    .pathMatchers(HttpMethod.DELETE, "/categories/**").hasRole("ADMIN")
                    .pathMatchers(HttpMethod.POST, "/media/**").hasRole("ADMIN")
                    
                    // Allow Admin to view all orders and create test orders
                    .pathMatchers(HttpMethod.GET, "/order/all").hasRole("ADMIN")
                    .pathMatchers(HttpMethod.POST, "/order/addOrder").hasAnyRole("CUSTOMER", "ADMIN")

                    // ---------- CUSTOMER APIs ----------
                    .pathMatchers(HttpMethod.POST, "/cart/**").hasRole("CUSTOMER")
                    .pathMatchers(HttpMethod.POST, "/order/**").hasRole("CUSTOMER")
                    .pathMatchers(HttpMethod.POST, "/addresses/**").hasRole("CUSTOMER")
                 // ---------- ADDRESS APIs ----------
                 // Only customers can manage (add/delete) their addresses
                 .pathMatchers(HttpMethod.POST, "/addresses/**").hasRole("CUSTOMER")
                 .pathMatchers(HttpMethod.DELETE, "/addresses/**").hasRole("CUSTOMER")
                 .pathMatchers(HttpMethod.PUT, "/addresses/**").hasRole("CUSTOMER")

                 // Both can view, but Service layer will filter the results
                 .pathMatchers(HttpMethod.GET, "/addresses/**").hasAnyRole("CUSTOMER", "ADMIN")
                    .anyExchange().authenticated()
            )

            // ✅ JWT filter
            .addFilterBefore(jwtFilter, SecurityWebFiltersOrder.AUTHENTICATION)
            .build();
     
    }
}
