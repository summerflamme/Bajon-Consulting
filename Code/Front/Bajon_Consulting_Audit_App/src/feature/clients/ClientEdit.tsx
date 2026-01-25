import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import "./clients.css"; // ✅ même design que le formulaire d’audit
import { supabase } from "../../supabaseClient";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../feature/auth/useAuth";

export default function ClientEditPage() {
  const { currentUser, currentRole } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // ----------------- PROTECTION ACCES -----------------
  useEffect(() => {
    if (!currentUser) return;
    if (currentRole !== "Administrateur") {
      navigate("/audits", { replace: true });
    }
  }, [currentUser, currentRole, navigate]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Champs individuels
  const [clientLastName, setClientLastName] = useState("");
  const [clientFirstName, setClientFirstName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientCity, setClientCity] = useState("");
  const [clientCountry, setClientCountry] = useState("");
  const [siren, setSiren] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [businessActivity, setBusinessActivity] = useState("");
  const [rcsNumber, setRcsNumber] = useState("");
  const [shareCapital, setShareCapital] = useState("");
  const [socialNetworks, setSocialNetworks] = useState("");
  const [legalForm, setLegalForm] = useState("");
  const [logo, setLogo] = useState("");

  // ============================================
  // Chargement du client
  // ============================================
  useEffect(() => {
    const fetchClient = async () => {
      const { data, error } = await supabase
        .from("client")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Erreur chargement client :", error);
        return;
      }

      setClientLastName(data.clientlastname || "");
      setClientFirstName(data.clientfirstname || "");
      setClientEmail(data.clientemail || "");
      setClientPhone(data.clientphone || "");
      setCompanyName(data.companyname || "");
      setClientAddress(data.clientaddress || "");
      setClientCity(data.clientcity || "");
      setClientCountry(data.clientcountry || "");
      setSiren(data.siren || "");
      setVatNumber(data.vatnumber || "");
      setBusinessActivity(data.businessactivity || "");
      setRcsNumber(data.rcsnumber || "");
      setShareCapital(data.sharecapital || "");
      setSocialNetworks(data.socialnetworks || "");
      setLegalForm(data.legalform || "");
      setLogo(data.logo || "");

      setLoading(false);
    };

    fetchClient();
  }, [id]);

  if (loading) return <p>Chargement…</p>;

  // ============================================
  // Submit — Mettre à jour le client
  // ============================================
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload = {
      clientlastname: clientLastName,
      clientfirstname: clientFirstName,
      clientemail: clientEmail,
      clientphone: clientPhone,
      companyname: companyName,
      clientaddress: clientAddress,
      clientcity: clientCity,
      clientcountry: clientCountry,
      siren,
      vatnumber: vatNumber,
      businessactivity: businessActivity,
      rcsnumber: rcsNumber,
      sharecapital: shareCapital,
      socialnetworks: socialNetworks,
      legalform: legalForm,
      logo,
    };

    const { error } = await supabase
      .from("client")
      .update(payload)
      .eq("id", id);

    if (error) {
      setMessage("Erreur lors de la mise à jour.");
      return;
    }

    setMessage("Client mis à jour !");
    setTimeout(() => navigate(`/clients/${id}`), 800);
  };

  // ============================================
  // Formulaire
  // ============================================
  return (
    <div className="new-audits">
      <h2 className="titre-new-audits">Modifier le client</h2>

      <form onSubmit={handleSubmit} className="new-audits-form">
        {/* Nom / Prénom */}
        <div className="Client-info-name">
          <div className="field">
            <label>Nom du client</label>
            <input
              className="input-style"
              value={clientLastName}
              onChange={(e) => setClientLastName(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Prénom du client</label>
            <input
              className="input-style"
              value={clientFirstName}
              onChange={(e) => setClientFirstName(e.target.value)}
            />
          </div>
        </div>

        {/* Adresse / Ville / Pays */}
        <div className="Client-info-adr">
          <div className="field">
            <label>Adresse</label>
            <input
              className="input-style"
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Ville</label>
            <input
              className="input-style"
              value={clientCity}
              onChange={(e) => setClientCity(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Pays</label>
            <input
              className="input-style"
              value={clientCountry}
              onChange={(e) => setClientCountry(e.target.value)}
            />
          </div>
        </div>

        {/* Email */}
        <div className="Client-info-mail">
          <div className="field">
            <label>Email</label>
            <input
              className="input-style"
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Téléphone + RCS */}
        <div className="Client-info-contact">
          <div className="field">
            <label>Téléphone</label>
            <PhoneInput
              inputClassName="input-style"
              defaultCountry="fr"
              value={clientPhone}
              onChange={(value) => setClientPhone(value)}
            />
          </div>

          <div className="field">
            <label>Numéro RCS</label>
            <input
              className="input-style"
              value={rcsNumber}
              onChange={(e) => setRcsNumber(e.target.value)}
            />
          </div>
        </div>

        {/* Informations entreprise */}
        <div className="Client-business-info">
          <div className="field">
            <label>Nom de l'entreprise</label>
            <input
              className="input-style"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Activité</label>
            <input
              className="input-style"
              value={businessActivity}
              onChange={(e) => setBusinessActivity(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Capital social</label>
            <input
              className="input-style"
              value={shareCapital}
              onChange={(e) => setShareCapital(e.target.value)}
            />
          </div>
        </div>

        {/* TVA / Forme juridique */}
        <div className="Client-business-legal">
          <div className="field">
            <label>Numéro TVA</label>
            <input
              className="input-style"
              value={vatNumber}
              onChange={(e) => setVatNumber(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Forme juridique</label>
            <input
              className="input-style"
              value={legalForm}
              onChange={(e) => setLegalForm(e.target.value)}
            />
          </div>
        </div>

        {/* Réseaux sociaux */}
        <div className="Client-business-social">
          <div className="field">
            <label>Réseaux sociaux</label>
            <input
              className="input-style"
              value={socialNetworks}
              onChange={(e) => setSocialNetworks(e.target.value)}
            />
          </div>
        </div>

        {/* Logo */}
        <div className="Client-business-img">
          <div className="field">
            <label>Logo (URL)</label>
            <input
              className="input-style"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
            />
          </div>
        </div>

        {/* Boutons */}
        <div className="form-actions">
          <button type="submit" className="new-audits-btn">
            Enregistrer
          </button>
          <button type="button" className="new-audits-btn" onClick={() => navigate("/clients")}>
            Annuler
          </button>
        </div>
      </form>

      {message && <p className="form-message">{message}</p>}
    </div>
  );
}
