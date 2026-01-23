package com.bajonconsulting.Bajon_audit_App.service;

import com.bajonconsulting.Bajon_audit_App.generator.PptxGenerator;
import com.bajonconsulting.Bajon_audit_App.types.AuditAnswerDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.List;
import java.util.Optional;

/**
 * Service de génération de présentations PowerPoint pour les audits.
 * <p>
 * Cette classe orchestre la récupération des réponses d'audit depuis Supabase et la génération
 * du fichier PPTX correspondant via {@link PptxGenerator}. Le fichier généré est sauvegardé
 * localement dans le répertoire `output/pptx` et retourné sous forme de tableau d'octets.
 * <p>
 * La classe est annotée {@code @Service} pour être gérée par le conteneur Spring.
 *
 * @author Bajon Consulting
 * @version 1.0
 * @see com.bajonconsulting.Bajon_audit_App.generator.PptxGenerator
 * @see com.bajonconsulting.Bajon_audit_App.service.SupabaseAnswersService
 */
@Service
public class PptxService {

    /**
     * Service de récupération des réponses d'audit depuis Supabase.
     */
    private final SupabaseAnswersService supabaseAnswersService;

    /**
     * Générateur de présentations PowerPoint.
     */
    private final PptxGenerator generator;

    /**
     * Mapper JSON utilisé pour le débogage des données d'audit.
     */
    private final ObjectMapper objectMapper = new ObjectMapper();


    /**
     * Encapsule le résultat de la génération PPTX.
     * <p>
     * Contient les données binaires du fichier et le nom de fichier suggéré.
     *
     * @param data le contenu du fichier PPTX sous forme de tableau d'octets
     * @param filename le nom de fichier suggéré pour le téléchargement
     */
    public static record PptxResult(byte[] data, String filename) {}

    /**
     * Répertoire de sortie pour la sauvegarde locale des fichiers PPTX.
     */
    private static final Path OUTPUT_DIR = Paths.get("output", "pptx");

    /**
     * Construit une instance du service avec les dépendances requises.
     *
     * @param supabaseAnswersService service de récupération des réponses d'audit
     * @param generator générateur de présentations PowerPoint
     */
    @Autowired
    public PptxService(SupabaseAnswersService supabaseAnswersService, PptxGenerator generator) {
        this.supabaseAnswersService = supabaseAnswersService;
        this.generator = generator;
    }

    /**
     * Crée une présentation PowerPoint pour un audit donné.
     * <p>
     * Le processus comprend les étapes suivantes :
     * <ul>
     *   <li>Récupération des réponses d'audit via {@link SupabaseAnswersService}</li>
     *   <li>Extraction du nom d'audit et du nom de l'entreprise depuis les réponses</li>
     *   <li>Génération du fichier PPTX via {@link PptxGenerator}</li>
     *   <li>Sauvegarde locale dans le répertoire `output/pptx`</li>
     * </ul>
     * <p>
     * Le nom de fichier généré suit le format : "Présentation [nom_audit] pour l'entreprise [nom_entreprise].pptx"
     *
     * @param idAudit l'identifiant de l'audit pour lequel générer la présentation
     * @return un {@link PptxResult} contenant les données du fichier et son nom
     * @throws IOException si une erreur survient lors de la génération ou de l'écriture du fichier
     */
    public PptxResult createPptx(int idAudit) throws IOException {
        List<AuditAnswerDto> answers = supabaseAnswersService.getAuditAnswers(idAudit).block();

        try {
            System.out.println(objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(answers));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            System.out.println(answers);
        }

        String aName = "audit-" + idAudit;
        String cName = "client";

        if (answers != null && !answers.isEmpty()) {
            Optional<AuditAnswerDto> anyWithNames = answers.stream()
                    .filter(a -> (a.getAuditName() != null && !a.getAuditName().isBlank())
                            || (a.getCompanyName() != null && !a.getCompanyName().isBlank()))
                    .findFirst();
            if (anyWithNames.isPresent()) {
                AuditAnswerDto dto = anyWithNames.get();
                if (dto.getAuditName() != null && !dto.getAuditName().isBlank()) aName = dto.getAuditName();
                if (dto.getCompanyName() != null && !dto.getCompanyName().isBlank()) cName = dto.getCompanyName();
            } else {
                AuditAnswerDto first = answers.get(0);
                if (first.getAuditName() != null && !first.getAuditName().isBlank()) aName = first.getAuditName();
                if (first.getCompanyName() != null && !first.getCompanyName().isBlank()) cName = first.getCompanyName();
            }
        }

        String filename = String.format("Présentation %s pour l'entreprise %s.pptx", aName, cName);
        String title = filename.replaceAll("\\.pptx$", ""); // title utilisé dans le template

        byte[] bytes = generator.generatePptx(title, answers);

        // Sauvegarde locale dans output/pptx
        try {
            Files.createDirectories(OUTPUT_DIR);
            Path filePath = OUTPUT_DIR.resolve(sanitizeFilename(filename));
            Files.write(filePath, bytes, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
            System.out.println("PPTX saved to: " + filePath.toAbsolutePath());
        } catch (IOException e) {
            System.err.println("Erreur lors de l'écriture du PPTX: " + e.getMessage());
            // on laisse l'exception remonter si nécessaire (méthode déclare throws IOException)
            throw e;
        }

        return new PptxResult(bytes, filename);
    }

    /**
     * Nettoie un nom de fichier en remplaçant les caractères invalides par des underscores.
     * <p>
     * Les caractères suivants sont remplacés : \ / : * ? " < > |
     *
     * @param name le nom de fichier à nettoyer; peut être null
     * @return le nom de fichier nettoyé, ou "output.pptx" si le paramètre est null
     */
    private String sanitizeFilename(String name) {
        if (name == null) return "output.pptx";
        return name.replaceAll("[\\\\/:*?\"<>|]", "_");
    }
}
