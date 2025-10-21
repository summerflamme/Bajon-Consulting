/**
 * useAuth.ts
 *
 * Hook personnalisé pour accéder facilement au contexte d'authentification.
 *
 * Usage :
 * - Importer et appeler `useAuth()` dans n'importe quel composant enfant du AuthProvider.
 * - Fournit directement les valeurs du contexte : `currentUser`, `currentRole`, `logout`.
 *
 * Exemple :
 *   const { currentUser, currentRole, logout } = useAuth();
 */
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export const useAuth = () => useContext(AuthContext);
