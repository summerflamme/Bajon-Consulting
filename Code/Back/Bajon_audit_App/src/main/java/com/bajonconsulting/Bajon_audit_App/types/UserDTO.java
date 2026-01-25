package com.bajonconsulting.Bajon_audit_App.types;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO (Data Transfer Object) représentant un utilisateur Supabase avec ses informations et métadonnées.
 * <p>
 * Cette classe encapsule les données d'un utilisateur retournées par l'API d'administration Supabase,
 * incluant les informations de base (ID, email, dates) et les métadonnées personnalisées
 * (nom, prénom, téléphone, rôle).
 * <p>
 * Les annotations Jackson {@code @JsonProperty} assurent le mapping correct entre les noms
 * de propriétés JSON de l'API Supabase et les attributs Java.
 *
 * @author Bajon Consulting
 * @version 1.0
 * @see com.bajonconsulting.Bajon_audit_App.types.UserMetadataDTO
 * @see com.bajonconsulting.Bajon_audit_App.service.SupabaseUsersService
 */
public class UserDTO {

    /**
     * Identifiant unique de l'utilisateur dans Supabase.
     * <p>
     * Mappé depuis la propriété JSON "id".
     */
    @JsonProperty("id")
    private String uid;

    /**
     * Adresse email de l'utilisateur.
     */
    private String email;

    /**
     * Date et heure de création du compte utilisateur.
     * <p>
     * Mappé depuis la propriété JSON "created_at".
     * Format : ISO 8601 (ex: "2024-01-15T10:30:00Z")
     */
    @JsonProperty("created_at")
    private String createdAt;

    /**
     * Date et heure de la dernière connexion de l'utilisateur.
     * <p>
     * Mappé depuis la propriété JSON "last_sign_in_at".
     * Format : ISO 8601 (ex: "2024-01-15T10:30:00Z")
     */
    @JsonProperty("last_sign_in_at")
    private String lastSignInAt;

    /**
     * Métadonnées personnalisées de l'utilisateur.
     * <p>
     * Contient les informations supplémentaires comme le nom complet, le téléphone,
     * le rôle et le nom d'affichage.
     * Mappé depuis la propriété JSON "user_metadata".
     */
    @JsonProperty("user_metadata")
    private UserMetadataDTO userMetadata;

    /**
     * Constructeur par défaut.
     * <p>
     * Nécessaire pour la désérialisation JSON par Jackson.
     */
    public UserDTO() {
    }

    /**
     * Récupère l'identifiant unique de l'utilisateur.
     *
     * @return l'identifiant unique (UID) de l'utilisateur
     */
    public String getUID() {
        return this.uid;
    }

    /**
     * Définit l'identifiant unique de l'utilisateur.
     *
     * @param uid l'identifiant unique à définir
     */
    public void setUID(String uid) {
        this.uid = uid;
    }

    /**
     * Récupère l'adresse email de l'utilisateur.
     *
     * @return l'adresse email
     */
    public String getEmail() {
        return this.email;
    }

    /**
     * Définit l'adresse email de l'utilisateur.
     *
     * @param email l'adresse email à définir
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * Récupère la date de création du compte.
     *
     * @return la date de création au format ISO 8601
     */
    public String getCreatedAt() {
        return this.createdAt;
    }

    /**
     * Définit la date de création du compte.
     *
     * @param createdAt la date de création à définir
     */
    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    /**
     * Récupère la date de la dernière connexion.
     *
     * @return la date de dernière connexion au format ISO 8601
     */
    public String getLastSignInAt() {
        return this.lastSignInAt;
    }

    /**
     * Définit la date de la dernière connexion.
     *
     * @param lastSignInAp la date de dernière connexion à définir
     */
    public void setLastSignInAt(String lastSignInAp) {
        this.lastSignInAt = lastSignInAp;
    }

    /**
     * Récupère l'objet contenant les métadonnées de l'utilisateur.
     *
     * @return les métadonnées de l'utilisateur
     */
    public UserMetadataDTO getUserMetadata() {
        return this.userMetadata;
    }

    /**
     * Définit les métadonnées de l'utilisateur.
     *
     * @param userMetadata les métadonnées à définir
     */
    public void setUserMetadata(UserMetadataDTO userMetadata) {
        this.userMetadata = userMetadata;
    }

    /**
     * Récupère le nom d'affichage de l'utilisateur depuis les métadonnées.
     * <p>
     * Méthode de commodité qui délègue à {@link UserMetadataDTO#getDisplayName()}.
     *
     * @return le nom d'affichage complet de l'utilisateur
     */
    public String getDsipalyName() {
        return userMetadata.getDisplayName();
    }

    /**
     * Récupère le numéro de téléphone de l'utilisateur depuis les métadonnées.
     * <p>
     * Méthode de commodité qui délègue à {@link UserMetadataDTO#getPhone()}.
     *
     * @return le numéro de téléphone de l'utilisateur
     */
    public String getPhone() {
        return userMetadata.getPhone();
    }

    /**
     * Récupère le rôle de l'utilisateur depuis les métadonnées.
     * <p>
     * Méthode de commodité qui délègue à {@link UserMetadataDTO#getRole()}.
     *
     * @return le rôle attribué à l'utilisateur
     */
    public String getCurrentRole() {
        return userMetadata.getRole();
    }

    /**
     * Récupère le prénom de l'utilisateur depuis les métadonnées.
     * <p>
     * Méthode de commodité qui délègue à {@link UserMetadataDTO#getFirstName()}.
     *
     * @return le prénom de l'utilisateur
     */
    public String getFirstName() {
        return userMetadata.getFirstName();
    }

    /**
     * Récupère le nom de famille de l'utilisateur depuis les métadonnées.
     * <p>
     * Méthode de commodité qui délègue à {@link UserMetadataDTO#getLastName()}.
     *
     * @return le nom de famille de l'utilisateur
     */
    public String getLastName() {
        return userMetadata.getLastName();
    }
}