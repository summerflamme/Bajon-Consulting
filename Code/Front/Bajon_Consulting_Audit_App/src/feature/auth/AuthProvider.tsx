/**
 * AuthProvider.tsx
 *
 * Ce composant React entoure l'application (ou certaines routes) pour fournir
 * le contexte d'authentification à tous les composants enfants.
 *
 * Fonctionnalités :
 * - Vérifie si un utilisateur est connecté au chargement (`supabase.auth.getUser()`).
 * - Écoute les changements de session en temps réel (`onAuthStateChange`).
 * - Fournit les informations `currentUser`, `currentRole` et la fonction `logout` via le contexte.
 * - Redirige automatiquement vers /audits après une connexion réussie.
 * - Permet de masquer l'application tant que la vérification n'est pas terminée (`loading`).
 *
 * Usage :
 * - Envelopper ton App ou tes Routes :
 *   <AuthProvider>
 *     <AppRoutes />
 *   </AuthProvider>
 */

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { supabase } from "../../supabaseClient";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (data?.user) {
        setCurrentUser(data.user);
        setCurrentRole(data.user.user_metadata?.role ?? null);

        // Si l'utilisateur vient de se connecter, redirige vers /audits
        if (location.pathname === "/" || location.pathname === "/auth/login") {
          navigate("/audits");
        }
      } else {
        setCurrentUser(null);
        setCurrentRole(null);
      }

      setLoading(false);
    };

    checkUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      // Si on reçoit une nouvelle session (connexion), redirige aussi
      if (session?.user) {
        setCurrentUser(session.user);
        setCurrentRole(session.user.user_metadata?.role ?? null);
        if (location.pathname === "/" || location.pathname === "/auth/login") {
          navigate("/audits");
        }
      } else {
        setCurrentUser(null);
        setCurrentRole(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [navigate, location]);

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setCurrentUser(null);
      setCurrentRole(null);
      navigate("/auth/login");
    }
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ currentUser, currentRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
