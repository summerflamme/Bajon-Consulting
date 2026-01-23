package com.bajonconsulting.Bajon_audit_App.types;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AuditAnswerDto {

    @JsonProperty("idaudit")
    private int idaudit;

    @JsonProperty("auditname")
    private String auditName;

    @JsonProperty("companyname")
    private String companyName;

    @JsonProperty("idquestion")
    private Long questionId;

    @JsonProperty("idtheme")
    private Long themeId;

    @JsonProperty("themename")
    private String themeName;

    @JsonProperty("questionlabel")
    private String questionLabel;

    @JsonProperty("clientanswerpoints")
    private Double clientAnswerPoints;

    @JsonProperty("clientanswer")
    private String clientAnswer;

    public AuditAnswerDto() {}

    public int getIdaudit() {
        return idaudit;
    }

    public void setIdaudit(int idaudit) {
        this.idaudit = idaudit;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public Long getThemeId() {
        return themeId;
    }

    public void setThemeId(Long themeId) {
        this.themeId = themeId;
    }

    public Double getClientAnswerPoints() {
        return clientAnswerPoints;
    }

    public void setClientAnswerPoints(Double clientAnswerPoints) {
        this.clientAnswerPoints = clientAnswerPoints;
    }

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

    public String getAuditName() {
        return auditName;
    }

    public void setAuditName(String auditName) {
        this.auditName = auditName;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getThemeName() {
        return themeName;
    }

    public void setThemeName(String themeName) {
        this.themeName = themeName;
    }

    public String getQuestionLabel() {
        return questionLabel;
    }

    public void setQuestionLabel(String questionLabel) {
        this.questionLabel = questionLabel;
    }

    public String getClientAnswer() {
        return clientAnswer;
    }

    public void setClientAnswer(String clientAnswer) {
        this.clientAnswer = clientAnswer;
    }
}
