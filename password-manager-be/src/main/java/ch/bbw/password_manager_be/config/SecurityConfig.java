package ch.bbw.password_manager_be.config;

import ch.bbw.password_manager_be.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfig {

    @Autowired
    private UserRepository userRepository;  // Autowired UserRepository

    // Password Encoder: zum sicheren Hashen der Passwörter
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // UserDetailsService zur Authentifizierung aus der MySQL-Datenbank
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            // Benutzer aus der MySQL-Datenbank abrufen
            ch.bbw.password_manager_be.model.User userEntity = userRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            // User-Objekt mit den Benutzerinformationen zurückgeben
            return org.springframework.security.core.userdetails.User.builder()
                    .username(userEntity.getUsername())
                    .password(userEntity.getPassword())
                    .roles(userEntity.getRole())
                    .build();
        };
    }

    // DaoAuthenticationProvider: Authentifizierung mit den Benutzerdaten aus der MySQL-Datenbank
    @Bean
    public DaoAuthenticationProvider authenticationProvider(UserDetailsService userDetailsService) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    // Bean für Security Filter Chain
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/h2-console/**", "/api/auth/register", "/api/auth/login").permitAll()
                        .anyRequest().authenticated()
                )
                .build();
    }
}
