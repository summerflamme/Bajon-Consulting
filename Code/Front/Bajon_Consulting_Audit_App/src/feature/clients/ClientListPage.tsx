import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

import ClientCard from "./ClientCard";
import SearchBar from "../../components/SearchBar";
import "./clients.css";

// ✅ Typage strict du client
interface Client {
  id: string;
  clientfirstname: string;
  clientlastname: string;
  companyname?: string;
  clientemail?: string;
  clientphone?: string;
  clientaddress?: string;
  clientcity?: string;
}

function ClientListPage() {
  const navigate = useNavigate();

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔍 SearchBar states
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("alphabetique");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // 🟦 FETCH CLIENTS
  const fetchClients = useCallback(async () => {
    setLoading(true);

    let query = supabase.from("client").select("*");

    // Recherche texte
    if (searchTerm.trim() !== "") {
      const term = `%${searchTerm}%`;
      query = query.or(
        `clientfirstname.ilike('${term}'),clientlastname.ilike('${term}'),companyname.ilike('${term}')`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("Erreur Supabase (client) :", error);
      setLoading(false);
      return;
    }

    const result = [...(data || [])] as Client[];

    // Tri
    if (sortField === "alphabetique") {
      result.sort((a, b) => {
        const nameA = `${a.clientlastname}${a.clientfirstname}`.toLowerCase();
        const nameB = `${b.clientlastname}${b.clientfirstname}`.toLowerCase();
        return sortOrder === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      });
    }

    setClients(result);
    setLoading(false);
  }, [searchTerm, sortField, sortOrder]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // 🟦 ACTIONS
  const handleConsult = (id: string) => navigate(`/clients/info/${id}`);
  const handleEdit = (id: string) => navigate(`/clients/edit/${id}`);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Voulez-vous supprimer ce client ?")) return;

    const { error } = await supabase.from("client").delete().eq("id", id);

    if (error) {
      console.error("Erreur suppression client :", error);
      return;
    }

    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="fond-clients-list">
      {/* 🔍 Barre de recherche version clients */}
      <SearchBar
        variant="clients"
        onSearchChange={setSearchTerm}
        onSortChange={setSortField}
        onSortOrderChange={setSortOrder}
      />

      <div className="client-page-container">

        {/* TABLEAU CLIENTS */}
        <div className="client-list-wrapper">

          {/* HEADER */}
          <div className="client-header-row">
            <div className="client-cell">Nom</div>
            <div className="client-cell">Société</div>
            <div className="client-cell">Email</div>
            <div className="client-cell">Téléphone</div>
            <div className="client-cell">Adresse</div>
            <div className="client-cell actions">Actions</div>
          </div>

          {/* DATA */}
          {loading ? (
            <div className="client-empty">Chargement...</div>
          ) : clients.length > 0 ? (
            clients.map((client: Client) => (
              <ClientCard
                key={client.id}
                id={client.id}
                clientFirstName={client.clientfirstname}
                clientLastName={client.clientlastname}
                companyName={client.companyname}
                clientEmail={client.clientemail}
                clientPhone={client.clientphone}
                clientAddress={client.clientaddress}
                clientCity={client.clientcity}
                onConsult={handleConsult}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="client-empty">Aucun client trouvé</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClientListPage;
