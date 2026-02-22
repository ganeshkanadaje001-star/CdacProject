package com.freshbasket.api_gateway.security;

import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpMethod;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Slf4j
@Component
@RequiredArgsConstructor
public class CustomJwtVerificationFilter implements WebFilter {

    private final JwtUtils jwtUtils;

    private static final List<String> PUBLIC_URLS = List.of(
        "/User/signin",
        "/User/SignUp",
        "/v3/api-docs",
        "/swagger-ui"
    );

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {

        String path = exchange.getRequest().getURI().getPath();
        log.info("Gateway path: {}", path);
        HttpMethod method = exchange.getRequest().getMethod();

        // ✅ Skip JWT for public endpoints
        if (PUBLIC_URLS.stream().anyMatch(path::startsWith)) {
            return chain.filter(exchange);
        }
        // ✅ Also allow public reads defined in SecurityConfiguration
        if (method == HttpMethod.GET &&
                (path.startsWith("/products") || path.startsWith("/categories"))) {
            return chain.filter(exchange);
        }

        String authHeader = exchange.getRequest()
                .getHeaders()
                .getFirst(HttpHeaders.AUTHORIZATION);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String token = authHeader.substring(7);

        try {
            Claims claims = jwtUtils.validateToken(token);

            String email = claims.getSubject();
            String role = claims.get("user_role", String.class);
            String userId = claims.get("user_id", String.class);

            // ✅ Add headers for backend services
            ServerHttpRequest mutatedRequest = exchange.getRequest()
                    .mutate()
                    .header("X-User-Id", userId)
                    .header("X-Role", role)
                    .build();

            ServerWebExchange mutatedExchange =
                    exchange.mutate().request(mutatedRequest).build();

            // 🔥 ROLE_ prefix is REQUIRED
            List<GrantedAuthority> authorities =
                    List.of(new SimpleGrantedAuthority("ROLE_" + role));

            Authentication authentication =
                    new UsernamePasswordAuthenticationToken(email, null, authorities);

            log.info("Authenticated user={} role={}", email, role);

            return chain.filter(mutatedExchange)
                    .contextWrite(
                        ReactiveSecurityContextHolder.withAuthentication(authentication)
                    );

        } catch (Exception e) {
            log.error("JWT validation failed", e);
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }
    }
}
