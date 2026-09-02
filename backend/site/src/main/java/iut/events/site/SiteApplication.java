package iut.events.site;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
// Classe de demarrage de l'application Spring Boot.
public class SiteApplication {

	// Lance le serveur back-end et charge toute la configuration Spring.
	public static void main(String[] args) {
		SpringApplication.run(SiteApplication.class, args);
	}

}
