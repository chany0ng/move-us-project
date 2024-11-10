package com.ucamp.movieus.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecretString;

    private Key jwtSecretKey;
    private final long jwtExpirationInMs = 3600000; // 토큰 유효 시간 (1시간)

    @PostConstruct
    public void init() {
        if (jwtSecretString.length() < 64) {
            // 키가 짧을 경우 보안에 적합한 HS512용 키 생성
            jwtSecretKey = Keys.secretKeyFor(SignatureAlgorithm.HS512);
        } else {
            jwtSecretKey = Keys.hmacShaKeyFor(jwtSecretString.getBytes());
        }
    }

    // JWT 토큰 생성 메서드
    public String createToken(String email, String name, Integer userNum) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("name", name);
        claims.put("email", email);
        claims.put("userNum", userNum);
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationInMs)) // 유효 기간
                .signWith(jwtSecretKey) // 비밀 키로 서명
                .compact();
    }


    public String generateToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

        return Jwts.builder()
                .setSubject(Integer.toString(userPrincipal.getId())) // 사용자 ID
                .claim("email", userPrincipal.getEmail()) // 사용자 이메일 추가
                .claim("name", userPrincipal.getUserName()) // 사용자 이름 추가
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(jwtSecretKey)  // 생성된 키로 서명
                .compact();
    }

    public Integer getUserIdFromJWT(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(jwtSecretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return Integer.parseInt(claims.getSubject());
    }

    public Integer getUserNumFromJWT(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(jwtSecretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.get("userNum", Integer.class); // userNum 추출
    }

    public String getEmailFromJWT(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(jwtSecretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.get("email", String.class); // 이메일을 클레임에서 가져오기
    }

    public String getNameFromJWT(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(jwtSecretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.get("name", String.class); // 이름을 클레임에서 가져오기
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(jwtSecretKey)
                    .build()
                    .parseClaimsJws(authToken);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String generateTokenByEmailAndName(String email, String userName, Integer userNum) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

        return Jwts.builder()
                .setSubject(email) // 사용자 이메일을 Subject로 설정
                .claim("email", email) // 사용자 이메일 추가
                .claim("name", userName) // 사용자 이름 추가
                .claim("userNum", userNum)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(jwtSecretKey) // 생성된 키로 서명
                .compact();
    }

}
