package com.bajonconsulting.Bajon_audit_App.types;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Classe de configuration pour les propriétés de connexion à Supabase.
 * <p>
 * Cette classe est annotée avec {@code @ConfigurationProperties} pour charger automatiquement
 * les propriétés préfixées par "supabase" depuis le fichier de configuration de l'application
 * (application.properties ou application.yml).
 * <p>
 * Elle encapsule les informations d'authentification nécessaires pour interagir avec l'API Supabase :
 * <ul>
 *   <li>URL de base de l'API</li>
 *   <li>Clé anonyme (anon key) pour les opérations côté client</li>
 *   <li>Clé de rôle de service (service role key) pour les opérations d'administration</li>
 * </ul>
 * <p>
 * Exemple de configuration dans application.properties :
 * <pre>
 * supabase.url=https://your-project.supabase.co/
 * supabase.anon-key=your-anon-key
 * supabase.service-role-key=your-service-role-key
 * </pre>
 *
 * @author Bajon Consulting
 * @version 1.0
 * @see org.springframework.boot.context.properties.ConfigurationProperties
 */
@Configuration
@ConfigurationProperties(prefix = "supabase")
public class SupabaseProperties {

    /**
     * URL de base de l'API Supabase.
     * <p>
     * Correspond à l'URL du projet Supabase (ex: https://your-project.supabase.co/).
     */
    private String url;

    /**
     * Clé anonyme (anon key) pour les requêtes côté client.
     * <p>
     * Cette clé permet d'effectuer des opérations avec les permissions définies
     * par les politiques RLS (Row Level Security) de Supabase.
     */
    private String anonKey;

    /**
     * Clé de rôle de service (service role key) pour les opérations d'administration.
     * <p>
     * Cette clé contourne les politiques RLS et donne un accès complet à la base de données.
     * Elle doit être utilisée uniquement côté serveur et gardée confidentielle.
     */
    private String serviceRoleKey;

    /**
     * Récupère l'URL de base de l'API Supabase.
     *
     * @return l'URL de l'API Supabase
     */
    public String getUrl() {
        return url;
    }

    /**
     * Définit l'URL de base de l'API Supabase.
     *
     * @param url l'URL de l'API Supabase à définir
     */
    public void setUrl(String url) {
        this.url = url;
    }

    /**
     * Récupère la clé anonyme (anon key).
     *
     * @return la clé anonyme pour les requêtes côté client
     */
    public String getAnonKey() {
        return anonKey;
    }

    /**
     * Définit la clé anonyme (anon key).
     *
     * @param anonKey la clé anonyme à définir
     */
    public void setAnonKey(String anonKey) {
        this.anonKey = anonKey;
    }

    /**
     * Récupère la clé de rôle de service (service role key).
     *
     * @return la clé de rôle de service pour les opérations d'administration
     */
    public String getServiceRoleKey() {
        return serviceRoleKey;
    }

    /**
     * Définit la clé de rôle de service (service role key).
     *
     * @param serviceRoleKey la clé de rôle de service à définir
     */
    public void setServiceRoleKey(String serviceRoleKey) {
        this.serviceRoleKey = serviceRoleKey;
    }
}