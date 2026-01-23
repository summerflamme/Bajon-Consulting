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

/**
 * Génère des présentations PowerPoint (.pptx) à partir d'un modèle et d'une liste de réponses d'audit.
 * <p>
 * Cette classe utilise Apache POI pour manipuler les slides et JFreeChart (via {@link GrapheGenerator})
 * pour créer les graphiques insérés dans la présentation. Elle remplace des marqueurs présents dans
 * le template (par exemple {{TITRE}}, {{NOM_CLIENT}}, {{IMAGE1}}, {{IMAGE2}}, {{IMAGE3}}) par du
 * contenu dynamique et ajoute les images de graphiques aux positions définies.
 * <p>
 * La classe est annotée {@code @Component} pour être gérée par le conteneur Spring.
 *
 * @author Bajon Consulting
 * @version 1.0
 * @see com.bajonconsulting.Bajon_audit_App.generator.GrapheGenerator
 */
@Component
public class PptxGenerator {
    /**
     * Générateur de graphiques réutilisable.
     * <p>
     * Instance privée et finale utilisée pour construire les objets JFreeChart insérés dans les
     * slides (heatmap, bar chart, pie chart).
     */
    private final GrapheGenerator grapheGenerator = new GrapheGenerator();

    /**
     * Génère un fichier PPTX en mémoire à partir d'un titre et d'une liste de réponses d'audit.
     * <p>
     * Si un template `template.pptx` est présent dans le classpath, il est utilisé comme base
     * et les marqueurs sont remplacés :
     * <ul>
     *   <li>{{TITRE}} : remplacé par le paramètre {@code title}</li>
     *   <li>{{NOM_CLIENT}} : remplacé par "Bajon Consulting"</li>
     *   <li>{{IMAGE1}} : remplacé par une heatmap (carte de chaleur)</li>
     *   <li>{{IMAGE2}} : remplacé par un graphique en barres (moyenne par thème)</li>
     *   <li>{{IMAGE3}} : remplacé par un graphique circulaire (répartition des réponses)</li>
     * </ul>
     * <p>
     * Si le template est absent, une présentation minimale est créée avec le titre fourni.
     * Les graphiques sont générés via {@link GrapheGenerator} et insérés aux ancres définies.
     *
     * @param title le titre à insérer dans la présentation; peut être null pour utiliser une valeur par défaut
     * @param answers la liste des réponses d'audit utilisée pour construire les graphiques; ne doit pas être null
     * @return un tableau d'octets contenant le contenu du fichier PPTX généré
     * @throws IOException si une erreur survient lors de la lecture du template ou de l'écriture des images/pptx
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
