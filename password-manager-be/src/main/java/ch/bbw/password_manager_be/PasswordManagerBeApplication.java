package ch.bbw.password_manager_be;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@SpringBootApplication
public class PasswordManagerBeApplication {

	public static void main(String[] args) {
		SpringApplication.run(PasswordManagerBeApplication.class, args);
	}

	@RestController
	@RequestMapping("/api")
	public static class UserController {

		private static final String DATABASE_FILE = "password-manager-be/src/main/resources/database.json";
		private final ObjectMapper objectMapper = new ObjectMapper();

		@PostMapping("/login")
		public Map<String, Object> login(@RequestBody Map<String, String> payload) {
			String email = payload.get("email");
			String masterPassword = payload.get("masterPassword");

			try {
				Map<String, Object> database = readDatabase();
				System.out.println("Database loaded: " + database);

				if (database.containsKey(email)) {
					Map<String, Object> userData = (Map<String, Object>) database.get(email);
					String storedPassword = (String) userData.get("password");


					if (storedPassword.equals(masterPassword)) {
						System.out.println("Login successful");
						return Map.of("success", true);
					} else {
						System.out.println("Invalid password");
					}
				} else {
					System.out.println("Email not found in database");
				}
				return Map.of("success", false, "message", "Invalid email or password");
			} catch (IOException e) {
				e.printStackTrace();
				return Map.of("success", false, "message", "Error reading database");
			}
		}


		@PostMapping("/passwords/add")
		public Map<String, Object> addPassword(@RequestBody Map<String, Object> payload) {
			String user = (String) payload.get("user");
			Map<String, Object> newPassword = (Map<String, Object>) payload.get("newPassword");

			try {
				Map<String, Object> database = readDatabase();

				if (!database.containsKey(user)) {
					database.put(user, new HashMap<String, Object>());
					((Map<String, Object>) database.get(user)).put("data", new ArrayList<>());
				}

				List<Map<String, Object>> userData = (List<Map<String, Object>>) ((Map<String, Object>) database.get(user)).get("data");
				userData.add(newPassword);

				writeDatabase(database);

				return Map.of("success", true);
			} catch (IOException e) {
				e.printStackTrace();
				return Map.of("success", false, "message", "Failed to add password");
			}
		}

		@GetMapping("/passwords/retrieve")
		public Map<String, Object> retrievePasswords() {
			try {
				return readDatabase();
			} catch (IOException e) {
				e.printStackTrace();
				return new HashMap<>();
			}
		}

		private Map<String, Object> readDatabase() throws IOException {
			File file = new File(DATABASE_FILE);
			if (!file.exists()) {
				return new HashMap<>();
			}
			return objectMapper.readValue(file, Map.class);
		}

		private void writeDatabase(Map<String, Object> database) throws IOException {
			objectMapper.writeValue(new File(DATABASE_FILE), database);
		}
	}

	@Configuration
	public static class SecurityConfig {

		@Bean
		public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
			http
					.csrf(csrf -> csrf.disable()) // Disable CSRF for simplicity
					.authorizeHttpRequests(auth -> auth.anyRequest().permitAll()); // Allow all requests without authentication

			return http.build();
		}
	}
}
