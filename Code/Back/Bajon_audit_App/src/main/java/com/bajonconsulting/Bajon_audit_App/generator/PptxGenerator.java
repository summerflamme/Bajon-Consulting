package com.bajonconsulting.Bajon_audit_App.generator;

import com.bajonconsulting.Bajon_audit_App.types.AuditAnswerDto;
import org.apache.poi.sl.usermodel.PictureData;
import org.jfree.chart.JFreeChart;
import org.springframework.stereotype.Component;
import org.apache.poi.xslf.usermodel.*;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Component
public class PptxGenerator {
    private final GrapheGenerator grapheGenerator = new GrapheGenerator();



    /**
     * Génère un PPTX en utilisant la liste d'AuditAnswerDto pour produire le heatmap.
     * Le template peut contenir {{IMAGE1}} pour la heatmap et {{IMAGE2}} pour le line chart.
     */
    public byte[] generatePptx(String title, List<AuditAnswerDto> answers) throws IOException {
        InputStream in = PptxGenerator.class.getResourceAsStream("/template.pptx");

        try (InputStream templateStream = in;
             XMLSlideShow ppt = (templateStream != null) ? new XMLSlideShow(templateStream) : new XMLSlideShow();
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            if (templateStream == null) {
                XSLFSlide slide = ppt.createSlide();
                XSLFTextBox box = slide.createTextBox();
                box.setText(title != null ? title : "Titre");
            } else {
                for (XSLFSlide slide : ppt.getSlides()) {
                    List<XSLFShape> shapes = new ArrayList<>(slide.getShapes());
                    for (XSLFShape shape : shapes) {
                        if (shape instanceof XSLFTextShape textShape) {
                            String text = textShape.getText();
                            if (text == null) continue;

                            if (title != null && text.contains("{{TITRE}}")) {
                                textShape.setText(text.replace("{{TITRE}}", title));
                                text = textShape.getText();
                            }
                            if (text.contains("{{NOM_CLIENT}}")) {
                                textShape.setText(text.replace("{{NOM_CLIENT}}", "Bajon Consulting"));
                                text = textShape.getText();
                            }

                            if (text.contains("{{IMAGE1}}")) {
                                slide.removeShape(shape);

                                // Utilise la nouvelle méthode d'instance pour construire le heatmap
                                JFreeChart heatmap = grapheGenerator.getHeatmap(answers);
                                BufferedImage chartImage = heatmap.createBufferedImage(600, 400);
                                byte[] imgBytes;
                                try (ByteArrayOutputStream imgBaos = new ByteArrayOutputStream()) {
                                    ImageIO.write(chartImage, "png", imgBaos);
                                    imgBytes = imgBaos.toByteArray();
                                }

                                XSLFPictureData pd = ppt.addPicture(imgBytes, PictureData.PictureType.PNG);
                                XSLFPictureShape pic = slide.createPicture(pd);
                                pic.setAnchor(new Rectangle(100, 100, 300, 200));
                            }
                            if (text.contains("{{IMAGE2}}")) {
                                // conserve le comportement existant pour un line chart example
                                JFreeChart chart2 = grapheGenerator.getBarChartAvgByTheme(answers);
                                BufferedImage chartImage2 = chart2.createBufferedImage(600, 400);
                                byte[] imgBytes2;
                                try (ByteArrayOutputStream imgBaos2 = new ByteArrayOutputStream()) {
                                    ImageIO.write(chartImage2, "png", imgBaos2);
                                    imgBytes2 = imgBaos2.toByteArray();
                                }
                                XSLFPictureData pd2 = ppt.addPicture(imgBytes2, PictureData.PictureType.PNG);
                                XSLFPictureShape pic2 = slide.createPicture(pd2);
                                pic2.setAnchor(new Rectangle(100, 320, 300, 200));
                            }
                            if (text.contains("{{IMAGE3}}")) {
                                // conserve le comportement existant pour un line chart example
                                JFreeChart chart3 = grapheGenerator.getPieChartResponseTypeDistribution(answers);
                                BufferedImage chartImage2 = chart3.createBufferedImage(600, 400);
                                byte[] imgBytes2;
                                try (ByteArrayOutputStream imgBaos2 = new ByteArrayOutputStream()) {
                                    ImageIO.write(chartImage2, "png", imgBaos2);
                                    imgBytes2 = imgBaos2.toByteArray();
                                }
                                XSLFPictureData pd2 = ppt.addPicture(imgBytes2, PictureData.PictureType.PNG);
                                XSLFPictureShape pic2 = slide.createPicture(pd2);
                                pic2.setAnchor(new Rectangle(100, 320, 300, 200));
                            }
                        }
                    }
                }
            }
            ppt.write(baos);
            return baos.toByteArray();
        }
    }
}
