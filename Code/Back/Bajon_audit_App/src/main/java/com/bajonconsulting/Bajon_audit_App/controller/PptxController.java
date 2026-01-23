package com.bajonconsulting.Bajon_audit_App.controller;

import com.bajonconsulting.Bajon_audit_App.service.PptxService;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

/**
 * Contrôleur REST pour la génération et le téléchargement de présentations PowerPoint.
 * <p>
 * Ce contrôleur expose des endpoints permettant de générer et télécharger des fichiers PPTX
 * basés sur les données d'audit.
 *
 * @author Bajon Consulting
 * @version 1.0
 */

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/pptx")
public class PptxController {

    private final PptxService pptxService;
    /**
     * Constructeur avec injection de dépendance du service PPTX.
     *
     * @param pptxService le service de génération de fichiers PowerPoint
     */
    public PptxController(PptxService pptxService) {
        this.pptxService = pptxService;
    }


    /**
     * Endpoint pour télécharger une présentation PowerPoint via paramètre de requête.
     * <p>
     * Accessible à : {@code GET /api/pptx/download?idAudit=3}
     *
     * @param idAudit l'identifiant de l'audit (valeur par défaut : 3)
     * @return une {@link ResponseEntity} contenant le fichier PPTX en tant que ressource téléchargeable
     * @throws IOException si une erreur survient lors de la génération du fichier
     */
    @GetMapping(value = "/download", produces = "application/vnd.openxmlformats-officedocument.presentationml.presentation")
    public ResponseEntity<ByteArrayResource> download(@RequestParam(defaultValue = "3") int idAudit) throws IOException {
        return buildDownloadResponse(idAudit);
    }

    /**
     * Endpoint pour télécharger une présentation PowerPoint via paramètre de chemin.
     * <p>
     * Accessible à : {@code GET /api/pptx/download/{idAudit}}
     *
     * @param idAudit l'identifiant de l'audit dans le chemin de l'URL
     * @return une {@link ResponseEntity} contenant le fichier PPTX en tant que ressource téléchargeable
     * @throws IOException si une erreur survient lors de la génération du fichier
     */
    @GetMapping(value = "/download/{idAudit}", produces = "application/vnd.openxmlformats-officedocument.presentationml.presentation")
    public ResponseEntity<ByteArrayResource> downloadById(@PathVariable int idAudit) throws IOException {
        return buildDownloadResponse(idAudit);
    }

    /**
     * Construit la réponse HTTP pour le téléchargement du fichier PowerPoint.
     * <p>
     * Cette méthode :
     * <ul>
     *   <li>Génère le fichier PPTX via le service</li>
     *   <li>Configure les en-têtes HTTP appropriés (Content-Disposition, Content-Type)</li>
     *   <li>Encode le nom de fichier en UTF-8 pour supporter les caractères spéciaux</li>
     * </ul>
     *
     * @param idAudit l'identifiant de l'audit pour lequel générer la présentation
     * @return une {@link ResponseEntity} contenant la ressource PPTX avec les en-têtes configurés
     * @throws IOException si une erreur survient lors de la génération ou de l'encodage du fichier
     */
    private ResponseEntity<ByteArrayResource> buildDownloadResponse(int idAudit) throws IOException {
        PptxService.PptxResult result = pptxService.createPptx(idAudit);
        byte[] data = result.data();
        String filename = result.filename();

        ByteArrayResource resource = new ByteArrayResource(data);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentDisposition(ContentDisposition.attachment().filename(filename).build());
        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.presentationml.presentation"));

        String encoded = URLEncoder.encode(filename, StandardCharsets.UTF_8.toString()).replaceAll("\\+", "%20");
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=UTF-8''" + encoded);

        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(data.length)
                .body(resource);
    }
}
