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

@Service
public class PptxService {
    private final SupabaseAnswersService supabaseAnswersService;
    private final PptxGenerator generator;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public static record PptxResult(byte[] data, String filename) {}

    private static final Path OUTPUT_DIR = Paths.get("output", "pptx");

    @Autowired
    public PptxService(SupabaseAnswersService supabaseAnswersService, PptxGenerator generator) {
        this.supabaseAnswersService = supabaseAnswersService;
        this.generator = generator;
    }

    /**
     * Génère le PPTX pour l'id d'audit donné, le sauvegarde dans output/pptx et retourne les bytes + nom de fichier.
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

    private String sanitizeFilename(String name) {
        if (name == null) return "output.pptx";
        return name.replaceAll("[\\\\/:*?\"<>|]", "_");
    }
}
