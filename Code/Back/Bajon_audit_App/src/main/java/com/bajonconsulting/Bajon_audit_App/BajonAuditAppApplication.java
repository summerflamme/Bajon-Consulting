package com.bajonconsulting.Bajon_audit_App;

import java.util.List;
import java.sql.Connection;
import java.sql.SQLException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BajonAuditAppApplication implements CommandLineRunner {

	@Autowired
	private DatabaseService databaseService;

	public static void main(String[] args) {
		SpringApplication.run(BajonAuditAppApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		System.out.println("=== Test de connexion à la base de données ===");
		
		// Test de connexion basique avec DatabasePool
		try (Connection connection = DatabasePool.getConnection()) {
			System.out.println("Connexion réussie !");
		} catch (SQLException e) {
			System.err.println(" Échec directe : " + e.getMessage());
		}
		
		// Test avec le service
				if (databaseService.testConnection()) {
					System.out.println("Service bdd opérationnel !");

					// Petite requête SELECT sur la table 'client' (remplacez par le nom de votre table réelle)
					List<String> results = databaseService.getTable("client");
					System.out.println("Résultats SELECT : " + results.toString());

					System.out.println("Résultats SELECT après insert : " + results.toString());


				} else {
					System.err.println("Service bdd non opérationnel !");
				}
	}

}
