import "./clients.css";
import avatarImage from "../../assets/icone-entreprise.png";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

interface Client {
  id: string;
  clientlastname?: string | null;
  clientfirstname?: string | null;
  clientemail?: string | null;
  clientphone?: string | null;
  companyname?: string | null;
  clientaddress?: string | null;
  clientcity?: string | null;
  clientcountry?: string | null;
  siren?: string | null;
  vatnumber?: string | null;
  businessactivity?: string | null;
  rcsnumber?: string | null;
  sharecapital?: string | null;
  socialnetworks?: string | null;
  legalform?: string | null;
}

function ClientInfoPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchClient = async () => {
      const { data, error } = await supabase
        .from("client")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Erreur chargement client :", error);
      }

      setClient(data);
      setLoading(false);
    };

    fetchClient();
  }, [id]);

  if (loading) return <div>Chargement...</div>;
  if (!client) return <div>Aucun client trouvé.</div>;

  return (
    <div className="client-info-wrapper">
      <div className="client-avatar-container">
        <img
          src={avatarImage}
          alt="Avatar client"
          className="client-avatar"
        />
      </div>

      <div className="client-info-grid">
        {/* 🧍 Informations personnelles */}
        <div className="client-info-section">
          <h3>Informations personnelles</h3>
          <div className="client-info-row"><strong>Nom :</strong> {client.clientlastname ?? "-"}</div>
          <div className="client-info-row"><strong>Prénom :</strong> {client.clientfirstname ?? "-"}</div>
          <div className="client-info-row"><strong>Email :</strong> {client.clientemail ?? "-"}</div>
          <div className="client-info-row"><strong>Téléphone :</strong> {client.clientphone ?? "-"}</div>
        </div>

        {/* 🏢 Entreprise */}
        <div className="client-info-section">
          <h3>Entreprise</h3>
          <div className="client-info-row"><strong>Société :</strong> {client.companyname ?? "-"}</div>
          <div className="client-info-row"><strong>Adresse :</strong> {client.clientaddress ?? "-"}</div>
          <div className="client-info-row"><strong>Ville :</strong> {client.clientcity ?? "-"}</div>
          <div className="client-info-row"><strong>Pays :</strong> {client.clientcountry ?? "-"}</div>
          <div className="client-info-row"><strong>Activité :</strong> {client.businessactivity ?? "-"}</div>
        </div>

        {/* ⚖️ Informations légales */}
        <div className="client-info-section">
          <h3>Informations légales</h3>
          <div className="client-info-row"><strong>SIREN :</strong> {client.siren ?? "-"}</div>
          <div className="client-info-row"><strong>RCS :</strong> {client.rcsnumber ?? "-"}</div>
          <div className="client-info-row"><strong>Capital social :</strong> {client.sharecapital ?? "-"}</div>
          <div className="client-info-row"><strong>Numéro TVA :</strong> {client.vatnumber ?? "-"}</div>
          <div className="client-info-row"><strong>Forme juridique :</strong> {client.legalform ?? "-"}</div>
        </div>

        {/* 🌐 Réseaux sociaux */}
        <div className="client-info-section">
          <h3>Réseaux sociaux</h3>
          <div className="client-info-row">
            <strong>Réseaux :</strong> {client.socialnetworks ?? "-"}
          </div>
        </div>
      </div>

      <div className="client-actions">
        <button
          className="btn primary"
          onClick={() => navigate(`/clients/edit/${id}`)}
        >
          Modifier les informations
        </button>

        <button className="btn secondary" onClick={() => navigate("/clients/list")}>
          Retour
        </button>
      </div>
    </div>
  );
}

export default ClientInfoPage;
