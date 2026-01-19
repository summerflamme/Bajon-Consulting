import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import SearchBar from "../../components/SearchBar";
import UserRow from "./UserCard";
import "./users.css";
import { Plus } from "lucide-react";
import { useAuth } from "../../feature/auth/useAuth"; // ✅ AJOUT

interface APIUser {
  id: string;
  email: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  currentRole?: string | null;
  created_at: string;
  last_sign_in_at?: string | null;
  user_metadata?: {
    email?: string | null;
    phone?: string | null;
    role?: string | null;
    lastName?: string | null;
    firstName?: string | null;
  };
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt?: string;
  updatedAt?: string;
  role?: string;
}

function UserList() {
  const navigate = useNavigate();
  const { currentRole } = useAuth(); // ✅ AJOUT

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔐 PROTECTION ADMIN (AJOUT)
  useEffect(() => {
    if (currentRole && currentRole !== "Administrateur") {
      navigate("/audits", { replace: true });
    }
  }, [currentRole, navigate]);

  // 🧠 états pour la SearchBar
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [sortOption, setSortOption] = useState("alphabetique");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // --- Récupération des utilisateurs depuis le backend ---
  useEffect(() => {
    axios
      .get<APIUser[]>("http://localhost:8080/api/users/listUsers")
      .then((response) => {
        const normalized = response.data.map((u) => ({
          id: u.id,
          firstName: u.firstName || u.user_metadata?.firstName || "",
          lastName: u.lastName || u.user_metadata?.lastName || "",
          email: u.email || u.user_metadata?.email || "",
          phone: u.phone || u.user_metadata?.phone || "",
          role: u.currentRole || u.user_metadata?.role || "Utilisateur",
          createdAt: u.created_at,
          updatedAt: u.last_sign_in_at || "",
        }));
        setUsers(normalized);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des utilisateurs :", error);
      })
      .finally(() => setLoading(false));
  }, []);

  // --- 🔍 Filtrage et tri dynamique ---
  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (u) =>
          u.firstName.toLowerCase().includes(term) ||
          u.lastName.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term)
      );
    }

    if (roleFilter) {
      result = result.filter((u) => u.role === roleFilter);
    }

    result.sort((a, b) => {
      let compare = 0;
      if (sortOption === "alphabetique") {
        compare = (a.lastName + a.firstName).localeCompare(
          b.lastName + b.firstName
        );
      } else if (sortOption === "date_inscription") {
        compare =
          new Date(a.createdAt || 0).getTime() -
          new Date(b.createdAt || 0).getTime();
      } else if (sortOption === "last_connexion") {
        compare =
          new Date(a.updatedAt || 0).getTime() -
          new Date(b.updatedAt || 0).getTime();
      }
      return sortOrder === "asc" ? compare : -compare;
    });

    return result;
  }, [users, searchTerm, roleFilter, sortOption, sortOrder]);

  // --- Gestion des actions ---
  const handleConsultUser = (id: string) => navigate(`/users/info/${id}`);
  const handleEditUser = (id: string) => navigate(`/users/userForm/${id}`);
  const handleDeleteUser = (id: string) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      axios
        .delete(`http://localhost:8080/api/users/deleteUser/${id}`)
        .then(() => {
          setUsers((prev) => prev.filter((user) => user.id !== id));
          console.log('${id}');
        })
        .catch((error) =>
          console.error("Erreur lors de la suppression :", error)
        );
    }
  };

  return (
    <div className="fond-users-list">
      <SearchBar
        variant="users"
        onSearchChange={setSearchTerm}
        onRoleFilterChange={setRoleFilter}
        onSortChange={setSortOption}
        onSortOrderChange={setSortOrder}
      />

      <div className="user-page-container">
        <div className="user-list-header">
          <button
            className="user-list-btn"
            onClick={() => navigate(`/users/userForm/creation`)}
          >
            <Plus className="icon" />
            Ajouter un utilisateur
          </button>
        </div>

        <div className="user-list-wrapper">
          <div className="user-header-row">
            <div className="user-cell">Nom</div>
            <div className="user-cell">Email</div>
            <div className="user-cell">Téléphone</div>
            <div className="user-cell">Créé le</div>
            <div className="user-cell">Dernière connexion</div>
            <div className="user-cell actions">Actions</div>
          </div>

          {loading ? (
            <div className="user-empty">Chargement...</div>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <UserRow
                key={user.id}
                id={user.id}
                firstName={user.firstName}
                lastName={user.lastName}
                email={user.email}
                phone={user.phone}
                createdAt={user.createdAt}
                updatedAt={user.updatedAt}
                onConsult={handleConsultUser}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
              />
            ))
          ) : (
            <div className="user-empty">Aucun utilisateur trouvé</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserList;
