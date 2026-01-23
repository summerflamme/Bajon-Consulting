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
@SpringBootApplication
@EnableConfigurationProperties(SupabaseProperties.class)
public class BajonAuditAppApplication implements CommandLineRunner {


	public static void main(String[] args) throws IOException {
		SpringApplication.run(BajonAuditAppApplication.class, args);

//        PptxGenerator pptxGenerator = new PptxGenerator();
//        byte[] pptx = pptxGenerator.generatePptx("Compte rendu de l'audit de l'entreprise {entreprise} par {nom de l'auditeur");
//        Path out = Paths.get("/home/robin/cours/S5/SAE/PPTX/test.pptx");
//        Files.createDirectories(out.getParent());
//        Files.write(out, pptx);
	}

	@Override
	public void run(String... args) throws Exception {

	}

}
