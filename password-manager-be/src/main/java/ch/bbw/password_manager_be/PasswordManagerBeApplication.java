package ch.bbw.password_manager_be;

import org.owasp.validator.html.*;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.cors.CorsConfiguration;

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
				if (database.containsKey(email)) {
					Map<String, Object> userData = (Map<String, Object>) database.get(email);
					String storedPassword = (String) userData.get("password");

					if (storedPassword.equals(masterPassword)) {
						return Map.of("success", true);
					}
				}
				return Map.of("success", false, "message", "Invalid email or password");
			} catch (IOException e) {
				return Map.of("success", false, "message", "Error reading database");
			}
		}

		@PostMapping("/passwords/add")
		public Map<String, Object> addPassword(@RequestBody Map<String, Object> payload) throws PolicyException, ScanException {
			String user = (String) payload.get("user");
			Map<String, Object> newPassword = (Map<String, Object>) payload.get("newPassword");

			Policy policy = Policy.getInstance(PasswordManagerBeApplication.class.getResourceAsStream("/antisamy-tinymce.xml"));
			AntiSamy antiSamy = new AntiSamy();
			CleanResults cr = antiSamy.scan(newPassword.toString(), policy);

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
				return Map.of("success", false, "message", "Failed to add password");
			}
		}

		@GetMapping("/passwords/retrieve")
		public Map<String, Object> retrievePasswords() {
			try {
				return readDatabase();
			} catch (IOException e) {
				return new HashMap<>();
			}
		}

		@DeleteMapping("/passwords/delete/platform/{platform}")
		public Map<String, Object> deletePasswordByPlatform(@PathVariable String platform, @RequestBody Map<String, String> payload) {
			String user = payload.get("user");

			try {
				Map<String, Object> database = readDatabase();

				if (database.containsKey(user)) {
					List<Map<String, Object>> userData = (List<Map<String, Object>>) ((Map<String, Object>) database.get(user)).get("data");
					boolean removed = userData.removeIf(password -> platform.equals(password.get("platform")));

					if (removed) {
						writeDatabase(database);
						return Map.of("success", true);
					} else {
						return Map.of("success", false, "message", "Platform not found");
					}
				}
				return Map.of("success", false, "message", "User not found");
			} catch (IOException e) {
				return Map.of("success", false, "message", "Failed to delete password");
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
					.csrf(csrf -> csrf.disable())
					.cors(cors -> cors.configurationSource(request -> {
						var config = new CorsConfiguration();
						config.setAllowedOrigins(List.of("http://localhost:3000"));
						config.setAllowedMethods(List.of("*"));
						config.setAllowedHeaders(List.of("*"));
						config.setAllowCredentials(true);
						return config;
					}))
					.authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
			return http.build();
		}

	}
}
