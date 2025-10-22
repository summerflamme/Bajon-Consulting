/**
 * AuthProvider.tsx
 *
 * Fournit le contexte d'authentification à l'application.
 * - Vérifie la session utilisateur via Supabase.
 * - Redirige vers /audits après connexion.
 * - Redirige vers / (login) si aucune session.
 * - Fournit currentUser, currentRole et logout().
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

        // Si l'utilisateur est connecté et se trouve sur la page de login, on le redirige
        if (location.pathname === "/" || location.pathname === "/auth/login") {
          navigate("/audits", { replace: true });
        }
      } else {
        setCurrentUser(null);
        setCurrentRole(null);

        // Si pas d'utilisateur et qu’on essaie d’accéder à une autre page que login → redirige vers /
        if (location.pathname !== "/" && location.pathname !== "/auth/login") {
          navigate("/", { replace: true });
        }
      }

      setLoading(false);
    };

    checkUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser(session.user);
        setCurrentRole(session.user.user_metadata?.role ?? null);
        if (location.pathname === "/" || location.pathname === "/auth/login") {
          navigate("/audits", { replace: true });
        }
      } else {
        setCurrentUser(null);
        setCurrentRole(null);
        if (location.pathname !== "/" && location.pathname !== "/auth/login") {
          navigate("/", { replace: true });
        }
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [navigate, location]);

  // Déconnexion
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setCurrentUser(null);
      setCurrentRole(null);
      navigate("/", { replace: true });
    }
  };

  // Évite le rendu pendant la vérification initiale
  if (loading) return null;

  return (
    <AuthContext.Provider value={{ currentUser, currentRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
