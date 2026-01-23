// java
package com.bajonconsulting.Bajon_audit_App.generator;

import com.bajonconsulting.Bajon_audit_App.types.AuditAnswerDto;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.axis.NumberAxis;
import org.jfree.chart.axis.SymbolAxis;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.chart.plot.PlotRenderingInfo;
import org.jfree.chart.plot.XYPlot;
import org.jfree.chart.plot.Plot;
import org.jfree.chart.renderer.PaintScale;
import org.jfree.chart.renderer.LookupPaintScale;
import org.jfree.chart.renderer.xy.XYBlockRenderer;
import org.jfree.chart.renderer.category.BarRenderer;
import org.jfree.chart.plot.CategoryPlot;
import org.jfree.chart.plot.PiePlot;
import org.jfree.data.category.DefaultCategoryDataset;
import org.jfree.data.general.DefaultPieDataset;
import org.jfree.data.xy.DefaultXYZDataset;

import java.awt.*;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;

public class GrapheGenerator {

    // 1) Heatmap QuestionLabel / ThemeName (valeur = moyenne clientAnswerPoints)
    public JFreeChart getHeatmap(List<AuditAnswerDto> answers) {
        // Collect distinct labels
        List<String> questions = answers == null ? Collections.emptyList() :
                answers.stream()
                        .map(a -> safe(a.getQuestionLabel(), () -> "question-" + safeId(a.getQuestionId())))
                        .distinct()
                        .collect(Collectors.toList());
        List<String> themes = answers == null ? Collections.emptyList() :
                answers.stream()
                        .map(a -> safe(a.getThemeName(), () -> "theme-" + safeId(a.getThemeId())))
                        .distinct()
                        .collect(Collectors.toList());

        if (questions.isEmpty()) questions = Collections.singletonList("no-question");
        if (themes.isEmpty()) themes = Collections.singletonList("no-theme");

        // Aggregate average per (question, theme)
        Map<String, double[]> agg = new LinkedHashMap<>(); // key -> {sum, count}
        for (AuditAnswerDto a : Optional.ofNullable(answers).orElse(Collections.emptyList())) {
            String q = safe(a.getQuestionLabel(), () -> "question-" + safeId(a.getQuestionId()));
            String t = safe(a.getThemeName(), () -> "theme-" + safeId(a.getThemeId()));
            String key = q + "||" + t;
            double val = a.getClientAnswerPoints() != null ? a.getClientAnswerPoints() : 0.0;
            double[] s = agg.getOrDefault(key, new double[]{0.0, 0.0});
            s[0] += val;
            s[1] += 1.0;
            agg.put(key, s);
        }

        // Prepare XYZ arrays (one point per pair)
        int n = agg.size() == 0 ? 1 : agg.size();
        double[] xs = new double[n];
        double[] ys = new double[n];
        double[] zs = new double[n];

        Map<String, Integer> qIndex = new HashMap<>();
        Map<String, Integer> tIndex = new HashMap<>();
        for (int i = 0; i < questions.size(); i++) qIndex.put(questions.get(i), i);
        for (int i = 0; i < themes.size(); i++) tIndex.put(themes.get(i), i);

        int i = 0;
        double min = Double.POSITIVE_INFINITY;
        double max = Double.NEGATIVE_INFINITY;
        if (agg.isEmpty()) {
            xs[0] = 0; ys[0] = 0; zs[0] = 0.0; min = 0.0; max = 0.0;
        } else {
            for (Map.Entry<String, double[]> e : agg.entrySet()) {
                String[] parts = e.getKey().split("\\|\\|", 2);
                String q = parts[0], t = parts[1];
                double avg = e.getValue()[1] > 0 ? e.getValue()[0] / e.getValue()[1] : 0.0;
                int qi = qIndex.getOrDefault(q, 0);
                int ti = tIndex.getOrDefault(t, 0);
                xs[i] = qi;
                ys[i] = ti;
                zs[i] = avg;
                min = Math.min(min, avg);
                max = Math.max(max, avg);
                i++;
            }
        }

        DefaultXYZDataset dataset = new DefaultXYZDataset();
        dataset.addSeries("scores", new double[][]{xs, ys, zs});

        // Axes: use SymbolAxis to display labels at integer positions
        SymbolAxis xAxis = new SymbolAxis("Question", questions.toArray(new String[0]));
        xAxis.setGridBandsVisible(false);
        SymbolAxis yAxis = new SymbolAxis("Thème", themes.toArray(new String[0]));
        yAxis.setGridBandsVisible(false);

        XYBlockRenderer renderer = new XYBlockRenderer();
        renderer.setBlockWidth(1.0);
        renderer.setBlockHeight(1.0);

        // Paint scale (gradient) from green (low) to red (high)
        LookupPaintScale paintScale = new LookupPaintScale(min, max, Color.lightGray);
        int steps = 100;
        for (int k = 0; k < steps; k++) {
            double v = min + (max - min) * k / Math.max(1, steps - 1);
            float ratio = (float) (k / (double) Math.max(1, steps - 1));
            Color c = blend(new Color(0, 153, 0), new Color(204, 0, 0), ratio); // green->red
            paintScale.add(v, c);
        }
        renderer.setPaintScale(paintScale);

        NumberAxis nx = new NumberAxis(); nx.setVisible(false); // underlying numeric axis not shown
        NumberAxis ny = new NumberAxis(); ny.setVisible(false);

        XYPlot plot = new XYPlot(dataset, xAxis, yAxis, renderer);
        JFreeChart chart = new JFreeChart("Heatmap (Question / Thème) - Moyenne des points", JFreeChart.DEFAULT_TITLE_FONT, plot, true);
        return chart;
    }

    // 2) Bar chart : moyenne des points par thème
    public JFreeChart getBarChartAvgByTheme(List<AuditAnswerDto> answers) {
        Map<String, double[]> agg = new LinkedHashMap<>(); // theme -> {sum, count}
        for (AuditAnswerDto a : Optional.ofNullable(answers).orElse(Collections.emptyList())) {
            String t = safe(a.getThemeName(), () -> "theme-" + safeId(a.getThemeId()));
            double val = a.getClientAnswerPoints() != null ? a.getClientAnswerPoints() : 0.0;
            double[] s = agg.getOrDefault(t, new double[]{0.0, 0.0});
            s[0] += val;
            s[1] += 1.0;
            agg.put(t, s);
        }

        DefaultCategoryDataset dataset = new DefaultCategoryDataset();
        for (Map.Entry<String, double[]> e : agg.entrySet()) {
            double avg = e.getValue()[1] > 0 ? e.getValue()[0] / e.getValue()[1] : 0.0;
            dataset.addValue(avg, "Moyenne", e.getKey());
        }

        JFreeChart chart = ChartFactory.createBarChart(
                "Moyenne des points par Thème",
                "Thème",
                "Moyenne des points",
                dataset,
                PlotOrientation.VERTICAL,
                true,
                false,
                false
        );

        // afford some renderer tweaks
        CategoryPlot plot = chart.getCategoryPlot();
        BarRenderer renderer = (BarRenderer) plot.getRenderer();
        renderer.setSeriesPaint(0, new Color(79, 129, 189));
        return chart;
    }

    // 3) Pie / Donut chart : répartition des types de réponses (clientAnswer)
    public JFreeChart getPieChartResponseTypeDistribution(List<AuditAnswerDto> answers) {
        Map<String, Integer> counts = new LinkedHashMap<>();
        for (AuditAnswerDto a : Optional.ofNullable(answers).orElse(Collections.emptyList())) {
            String resp = "n/a";
            try {
                java.lang.reflect.Method m = a.getClass().getMethod("getClientAnswer");
                Object value = m.invoke(a);
                if (value != null) resp = String.valueOf(value);
            } catch (NoSuchMethodException e) {
                // getter absent -> fallback sur clientAnswerPoints
                resp = a.getClientAnswerPoints() != null ? String.valueOf(a.getClientAnswerPoints()) : "n/a";
            } catch (ReflectiveOperationException e) {
                // problème réflexion -> fallback sur clientAnswerPoints
                resp = a.getClientAnswerPoints() != null ? String.valueOf(a.getClientAnswerPoints()) : "n/a";
            }

            resp = safe(resp, () -> "n/a");
            counts.put(resp, counts.getOrDefault(resp, 0) + 1);
        }

        DefaultPieDataset dataset = new DefaultPieDataset();
        for (Map.Entry<String, Integer> e : counts.entrySet()) {
            dataset.setValue(e.getKey(), e.getValue());
        }

        JFreeChart chart = ChartFactory.createPieChart(
                "Répartition des types de réponses",
                dataset,
                true,
                false,
                false
        );

        PiePlot plot = (PiePlot) chart.getPlot();
        plot.setLabelGenerator(null);
        plot.setInteriorGap(0.04);
        plot.setSimpleLabels(true);
        plot.setCircular(true);
        return chart;
    }


    /* Helpers */
    private String safe(String value, java.util.function.Supplier<String> fallback) {
        if (value != null && !value.isBlank()) return value;
        return fallback.get();
    }

    private String safeId(Number id) {
        return id != null ? String.valueOf(id) : "n/a";
    }

    private Color blend(Color c1, Color c2, float ratio) {
        float r = Math.min(1f, Math.max(0f, ratio));
        int red = (int) (c1.getRed() * (1 - r) + c2.getRed() * r);
        int green = (int) (c1.getGreen() * (1 - r) + c2.getGreen() * r);
        int blue = (int) (c1.getBlue() * (1 - r) + c2.getBlue() * r);
        return new Color(red, green, blue);
    }
}
