package com.bajonconsulting.Bajon_audit_App.types;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;
import java.util.Map;

/**
 * Classe de réponse pour la désérialisation de la liste des utilisateurs depuis l'API Supabase.
 * <p>
 * Cette classe encapsule la réponse JSON retournée par l'API d'administration Supabase
 * lors de la récupération de la liste des utilisateurs. Elle utilise Jackson pour
 * la désérialisation automatique.
 * <p>
 * L'annotation {@code @JsonIgnoreProperties(ignoreUnknown = true)} permet d'ignorer
 * les propriétés JSON supplémentaires qui ne sont pas mappées dans cette classe,
 * assurant ainsi la compatibilité avec les évolutions futures de l'API.
 *
 * @author Bajon Consulting
 * @version 1.0
 * @see com.bajonconsulting.Bajon_audit_App.service.SupabaseUsersService
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class supabaseUsersResponse {

    /**
     * Liste des utilisateurs retournée par l'API Supabase.
     * <p>
     * Chaque utilisateur est représenté par une Map contenant les données brutes
     * de l'utilisateur (id, email, métadonnées, dates, etc.) qui seront ensuite
     * converties en objets {@link com.bajonconsulting.Bajon_audit_App.types.UserDTO}.
     */
    private List<Map<String, Object>> users;

    /**
     * Récupère la liste des utilisateurs.
     *
     * @return la liste des Maps représentant les utilisateurs
     */
    public List<Map<String, Object>> getUsers() {
        return users;
    }

    /**
     * Définit la liste des utilisateurs.
     *
     * @param users la liste des Maps représentant les utilisateurs à définir
     */
    public void setUsers(List<Map<String, Object>> users) {
        this.users = users;
    }
}