package com.freshbasket.security;

import java.util.Date;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

@Component //to declare a spring bean 
@Slf4j
public class JwtUtils {
	//value based D.I
	@Value("${jwt.expiration.time}") //SpEL
	private long jwtExpirationTime;
	@Value("${jwt.secret}")
	private String jwtSecret;
	
	//represents symmetric secret key used for signing as well as verifying JWT
	private SecretKey secretKey;
	
	@PostConstruct
	public void myInit()
	{
		log.info("****** creating symmetric secret key {} {} ",jwtSecret,jwtExpirationTime);
		secretKey=Keys.hmacShaKeyFor(jwtSecret.getBytes());		
	}
	//create JWT - header , payload, signature (method will be used by UserController : sign in)
	public String generateToken(UserPrincipal principal) {
		//iat  
		Date now=new Date();
		//exp
		Date expiresAt=new Date(now.getTime()+jwtExpirationTime);
		return Jwts.builder() //creates a builder for JWT creation
				.subject(principal.getEmail()) //setting subject 
				.issuedAt(now) //iat
				.expiration(expiresAt) //exp
				//custom claims - user id & user role
				.claims(Map.of("user_id",String.valueOf(principal.getUserId())
						, "user_role", principal.getUserRole()))
				.signWith(secretKey)//sign the JWT
				.compact();
				
	}
	//will be called by -Custom JWT Filter
	public Claims validateToken(String jwt) {
		return Jwts.parser() //attach a parser
				.verifyWith(secretKey)
				.build() //builds JwtsParser
				.parseSignedClaims(jwt)
				//=> valid JWT
				.getPayload();		//extracting Claims from validated JWT
	}

}
