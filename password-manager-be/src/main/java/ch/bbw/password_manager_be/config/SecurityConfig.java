package ch.bbw.password_manager_be.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        System.out.println("Security configuration applied!");
        http
                .csrf(csrf -> csrf.disable()) // CSRF deaktivieren
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/register", "/api/auth/login").permitAll() // Öffentlich zugängliche Endpunkte
                        .anyRequest().authenticated() // Alle anderen Endpunkte erfordern Authentifizierung
                )
                .httpBasic(Customizer.withDefaults()); // HTTP Basic Auth mit Default-Einstellungen
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
