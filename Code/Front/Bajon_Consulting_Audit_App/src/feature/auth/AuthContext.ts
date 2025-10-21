/**
 * AuthContext.ts
 *
 * Ce fichier définit le contexte React pour l'authentification.
 * Il contient uniquement la structure du contexte et ses valeurs par défaut.
 * 
 * Usage :
 * - Permet de partager l'état de l'utilisateur (`currentUser`) et son rôle (`currentRole`)
 *   ainsi que la fonction `logout` à travers toute l'application.
 * - Aucun composant React n'est défini ici.
 * - Pour utiliser le contexte, on peut faire `useContext(AuthContext)` dans un composant.
 */
import { createContext } from "react";

interface AuthContextType {
  currentUser: any | null;
  currentRole: string | null;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  currentRole: null,
  logout: async () => {},
});
