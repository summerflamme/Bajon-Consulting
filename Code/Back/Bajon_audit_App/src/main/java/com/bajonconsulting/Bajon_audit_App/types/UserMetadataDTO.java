package com.bajonconsulting.Bajon_audit_App.types;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO (Data Transfer Object) représentant les métadonnées personnalisées d'un utilisateur Supabase.
 * <p>
 * Cette classe encapsule les informations complémentaires d'un utilisateur stockées dans
 * la propriété "user_metadata" de Supabase, incluant le nom complet, le téléphone, le rôle
 * et le nom d'affichage.
 * <p>
 * L'annotation {@code @JsonIgnoreProperties(ignoreUnknown = true)} permet d'ignorer
 * les propriétés JSON supplémentaires qui ne sont pas mappées dans cette classe,
 * assurant ainsi la compatibilité avec les évolutions futures de l'API.
 *
 * @author Bajon Consulting
 * @version 1.0
 * @see com.bajonconsulting.Bajon_audit_App.types.UserDTO
 * @see com.bajonconsulting.Bajon_audit_App.service.SupabaseUsersService
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserMetadataDTO {

    /**
     * Adresse email de l'utilisateur.
     * <p>
     * Dupliquée dans les métadonnées pour faciliter l'accès aux informations utilisateur.
     */
    private String email;

    /**
     * Nom de famille de l'utilisateur.
     * <p>
     * Mappé depuis/vers la propriété JSON "lastName".
     */
    @JsonProperty("lastName")
    private String lastName;

    /**
     * Prénom de l'utilisateur.
     * <p>
     * Mappé depuis/vers la propriété JSON "firstName".
     */
    @JsonProperty("firstName")
    private String firstName;

    /**
     * Numéro de téléphone de l'utilisateur.
     */
    private String phone;

    /**
     * Rôle attribué à l'utilisateur dans l'application.
     * <p>
     * Exemples de valeurs possibles : "admin", "auditor", "client", etc.
     */
    private String role;

    /**
     * Nom d'affichage complet de l'utilisateur.
     * <p>
     * Généralement composé du prénom et du nom de famille concaténés.
     * Mappé depuis/vers la propriété JSON "displayName".
     */
    @JsonProperty("displayName")
    private String displayName;

    /**
     * Constructeur par défaut.
     * <p>
     * Nécessaire pour la désérialisation JSON par Jackson.
     */
    public UserMetadataDTO() {}

    /**
     * Récupère l'adresse email de l'utilisateur.
     *
     * @return l'adresse email
     */
    public String getEmail() {
        return email;
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
     * Récupère le nom de famille de l'utilisateur.
     *
     * @return le nom de famille
     */
    public String getLastName() {
        return lastName;
    }

    /**
     * Définit le nom de famille de l'utilisateur.
     *
     * @param lastName le nom de famille à définir
     */
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    /**
     * Récupère le prénom de l'utilisateur.
     *
     * @return le prénom
     */
    public String getFirstName() {
        return firstName;
    }

    /**
     * Définit le prénom de l'utilisateur.
     *
     * @param firstName le prénom à définir
     */
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    /**
     * Récupère le numéro de téléphone de l'utilisateur.
     *
     * @return le numéro de téléphone
     */
    public String getPhone() {
        return phone;
    }

    /**
     * Définit le numéro de téléphone de l'utilisateur.
     *
     * @param phone le numéro de téléphone à définir
     */
    public void setPhone(String phone) {
        this.phone = phone;
    }

    /**
     * Récupère le rôle de l'utilisateur.
     *
     * @return le rôle attribué à l'utilisateur
     */
    public String getRole() {
        return role;
    }

    /**
     * Définit le rôle de l'utilisateur.
     *
     * @param role le rôle à attribuer
     */
    public void setRole(String role) {
        this.role = role;
    }

    /**
     * Récupère le nom d'affichage complet de l'utilisateur.
     *
     * @return le nom d'affichage (prénom + nom)
     */
    public String getDisplayName() {
        return displayName;
    }

    /**
     * Définit le nom d'affichage complet de l'utilisateur.
     *
     * @param displayName le nom d'affichage à définir
     */
    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
}
