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

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/pptx")
public class PptxController {

    private final PptxService pptxService;



    public PptxController(PptxService pptxService) {
        this.pptxService = pptxService;
    }

    @GetMapping(value = "/download", produces = "application/vnd.openxmlformats-officedocument.presentationml.presentation")
    public ResponseEntity<ByteArrayResource> download(@RequestParam(defaultValue = "3") int idAudit) throws IOException {
        return buildDownloadResponse(idAudit);
    }
    @GetMapping(value = "/download/{idAudit}", produces = "application/vnd.openxmlformats-officedocument.presentationml.presentation")
    public ResponseEntity<ByteArrayResource> downloadById(@PathVariable int idAudit) throws IOException {
        return buildDownloadResponse(idAudit);
    }

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
