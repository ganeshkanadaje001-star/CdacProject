package com.freshbasket.api_gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(
	    exclude = {
	        org.springframework.boot.autoconfigure.security.reactive.ReactiveUserDetailsServiceAutoConfiguration.class
	    }
	)
public class FreshBasketApiGatewayApplication {

	public static void main(String[] args) {
		SpringApplication.run(FreshBasketApiGatewayApplication.class, args);
	}

}
