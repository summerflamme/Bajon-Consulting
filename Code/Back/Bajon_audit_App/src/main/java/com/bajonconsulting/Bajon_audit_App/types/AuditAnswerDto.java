package com.bajonconsulting.Bajon_audit_App.types;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO (Data Transfer Object) représentant une réponse d'audit avec ses informations associées.
 * <p>
 * Cette classe encapsule les données d'une réponse client à une question d'audit,
 * incluant les informations sur l'audit, la société, le thème et la question.
 * Elle utilise les annotations Jackson pour la sérialisation/désérialisation JSON.
 * <p>
 * Les noms de propriétés JSON sont en minuscules pour correspondre au format de l'API.
 *
 * @author Bajon Consulting
 * @version 1.0
 */
public class AuditAnswerDto {

    /**
     * Identifiant unique de l'audit.
     */
    @JsonProperty("idaudit")
    private int idaudit;

    /**
     * Nom de l'audit.
     */
    @JsonProperty("auditname")
    private String auditName;

    /**
     * Nom de la société concernée par l'audit.
     */
    @JsonProperty("companyname")
    private String companyName;

    /**
     * Identifiant unique de la question.
     */
    @JsonProperty("idquestion")
    private Long questionId;

    /**
     * Identifiant unique du thème auquel appartient la question.
     */
    @JsonProperty("idtheme")
    private Long themeId;

    /**
     * Nom du thème auquel appartient la question.
     */
    @JsonProperty("themename")
    private String themeName;

    /**
     * Libellé/texte de la question posée.
     */
    @JsonProperty("questionlabel")
    private String questionLabel;

    /**
     * Points attribués à la réponse du client.
     * <p>
     * Peut être null si aucun point n'a été attribué.
     */
    @JsonProperty("clientanswerpoints")
    private Double clientAnswerPoints;

    /**
     * Réponse textuelle fournie par le client.
     */
    @JsonProperty("clientanswer")
    private String clientAnswer;

    /**
     * Constructeur par défaut.
     * <p>
     * Nécessaire pour la désérialisation JSON par Jackson.
     */
    public AuditAnswerDto() {}

    /**
     * Récupère l'identifiant de l'audit.
     *
     * @return l'identifiant de l'audit
     */
    public int getIdaudit() {
        return idaudit;
    }

    /**
     * Définit l'identifiant de l'audit.
     *
     * @param idaudit l'identifiant de l'audit à définir
     */
    public void setIdaudit(int idaudit) {
        this.idaudit = idaudit;
    }

    /**
     * Récupère l'identifiant de la question.
     *
     * @return l'identifiant de la question
     */
    public Long getQuestionId() {
        return questionId;
    }

    /**
     * Définit l'identifiant de la question.
     *
     * @param questionId l'identifiant de la question à définir
     */
    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    /**
     * Récupère l'identifiant du thème.
     *
     * @return l'identifiant du thème
     */
    public Long getThemeId() {
        return themeId;
    }

    /**
     * Définit l'identifiant du thème.
     *
     * @param themeId l'identifiant du thème à définir
     */
    public void setThemeId(Long themeId) {
        this.themeId = themeId;
    }

    /**
     * Récupère les points attribués à la réponse du client.
     *
     * @return les points de la réponse, peut être null
     */
    public Double getClientAnswerPoints() {
        return clientAnswerPoints;
    }

    /**
     * Définit les points attribués à la réponse du client.
     *
     * @param clientAnswerPoints les points à attribuer
     */
    public void setClientAnswerPoints(Double clientAnswerPoints) {
        this.clientAnswerPoints = clientAnswerPoints;
    }

    /**
     * Retourne une représentation textuelle de l'objet AuditAnswerDto.
     * <p>
     * Inclut les principaux attributs pour faciliter le débogage.
     *
     * @return une chaîne de caractères représentant l'objet
     */
    @Override
    public String toString() {
        return "AuditAnswerDto{" +
                "idaudit= " + idaudit +
                ", questionId= " + questionId +
                ", auditName= " + auditName +
                ", companyName= " + companyName +
                ", themeId= " + themeId +
                ", clientAnswerPoints= " + clientAnswerPoints +
                '}';
    }

    /**
     * Récupère le nom de l'audit.
     *
     * @return le nom de l'audit
     */
    public String getAuditName() {
        return auditName;
    }

    /**
     * Définit le nom de l'audit.
     *
     * @param auditName le nom de l'audit à définir
     */
    public void setAuditName(String auditName) {
        this.auditName = auditName;
    }

    /**
     * Récupère le nom de la société.
     *
     * @return le nom de la société
     */
    public String getCompanyName() {
        return companyName;
    }

    /**
     * Définit le nom de la société.
     *
     * @param companyName le nom de la société à définir
     */
    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    /**
     * Récupère le nom du thème.
     *
     * @return le nom du thème
     */
    public String getThemeName() {
        return themeName;
    }

    /**
     * Définit le nom du thème.
     *
     * @param themeName le nom du thème à définir
     */
    public void setThemeName(String themeName) {
        this.themeName = themeName;
    }

    /**
     * Récupère le libellé de la question.
     *
     * @return le libellé de la question
     */
    public String getQuestionLabel() {
        return questionLabel;
    }

    /**
     * Définit le libellé de la question.
     *
     * @param questionLabel le libellé de la question à définir
     */
    public void setQuestionLabel(String questionLabel) {
        this.questionLabel = questionLabel;
    }

    /**
     * Récupère la réponse textuelle du client.
     *
     * @return la réponse du client
     */
    public String getClientAnswer() {
        return clientAnswer;
    }

    /**
     * Définit la réponse textuelle du client.
     *
     * @param clientAnswer la réponse du client à définir
     */
    public void setClientAnswer(String clientAnswer) {
        this.clientAnswer = clientAnswer;
    }
}