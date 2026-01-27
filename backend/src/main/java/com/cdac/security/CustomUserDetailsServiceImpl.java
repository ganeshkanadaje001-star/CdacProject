package com.cdac.security;

import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cdac.entity.User;
import com.cdac.repository.UserReopsitory;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class CustomUserDetailsServiceImpl implements UserDetailsService {

    private final UserReopsitory userRepository;

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        log.info("********* in load user");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "User by this email doesn't exist!"
                        ));

        return new UserPrincipal(
                String.valueOf(user.getId()),
                user.getEmail(),
                user.getPassword(),
                List.of(
                    new SimpleGrantedAuthority(
                        "ROLE_" + user.getRole().name()
                    )
                ),
                user.getRole().name()
        );
    }
}
