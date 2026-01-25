package com.bajonconsulting.Bajon_audit_App;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import com.bajonconsulting.Bajon_audit_App.generator.PptxGenerator;
import com.bajonconsulting.Bajon_audit_App.types.SupabaseProperties;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

/**
 * Classe principale de l'application Bajon Audit App.
 * <p>
 * Cette classe sert de point d'entrée pour l'application Spring Boot et implémente
 * {@link CommandLineRunner} pour permettre l'exécution de code au démarrage de l'application.
 * <p>
 * L'annotation {@code @SpringBootApplication} active :
 * <ul>
 *   <li>La configuration automatique Spring Boot</li>
 *   <li>Le scan des composants dans le package et ses sous-packages</li>
 *   <li>La configuration supplémentaire définie par l'application</li>
 * </ul>
 * <p>
 * L'annotation {@code @EnableConfigurationProperties} active le binding des propriétés
 * de configuration Supabase définies dans {@link SupabaseProperties}.
 *
 * @author Bajon Consulting
 * @version 1.0
 * @see org.springframework.boot.SpringApplication
 * @see org.springframework.boot.CommandLineRunner
 * @see com.bajonconsulting.Bajon_audit_App.types.SupabaseProperties
 */
@SpringBootApplication
@EnableConfigurationProperties(SupabaseProperties.class)
public class BajonAuditAppApplication implements CommandLineRunner {

    /**
     * Point d'entrée principal de l'application.
     * <p>
     * Cette méthode démarre le contexte Spring Boot et initialise tous les composants
     * de l'application (contrôleurs, services, repositories, etc.).
     * <p>
     * Le code commenté montre un exemple d'utilisation du générateur PPTX pour créer
     * des présentations de comptes rendus d'audit.
     *
     * @param args arguments de ligne de commande passés à l'application
     * @throws IOException si une erreur d'entrée/sortie se produit lors du démarrage
     */
    public static void main(String[] args) throws IOException {
        SpringApplication.run(BajonAuditAppApplication.class, args);

//        PptxGenerator pptxGenerator = new PptxGenerator();
//        byte[] pptx = pptxGenerator.generatePptx("Compte rendu de l'audit de l'entreprise {entreprise} par {nom de l'auditeur");
//        Path out = Paths.get("/home/robin/cours/S5/SAE/PPTX/test.pptx");
//        Files.createDirectories(out.getParent());
//        Files.write(out, pptx);
    }

    /**
     * Méthode exécutée automatiquement après le démarrage complet de l'application Spring Boot.
     * <p>
     * Cette méthode fait partie de l'interface {@link CommandLineRunner} et permet d'exécuter
     * du code personnalisé au démarrage de l'application, comme l'initialisation de données,
     * des traitements batch ou des vérifications.
     * <p>
     * Actuellement vide, elle peut être utilisée pour ajouter de la logique de démarrage.
     *
     * @param args arguments de ligne de commande passés à l'application
     * @throws Exception si une erreur se produit lors de l'exécution
     */
    @Override
    public void run(String... args) throws Exception {

    }
}