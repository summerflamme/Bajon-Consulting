import { useState, useEffect } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import "./NewAudit.css";
import { supabase } from "../../../supabaseClient";

export default function NewAuditPage() {
  const [nameAudit, setNameAudit] = useState("");
  const [auditType, setAuditType] = useState<any[]>([]);
  const [auditOffer, setAuditOffer] = useState<any[]>([]);
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
  const [error, setError] = useState("");

  const [message, setMessage] = useState("");
  const validEmail = new RegExp(
    "^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$"
  );
  const validPhone = new RegExp("^(\\+33|0)[1-9](\\d{2}){4}$");

  const [audits, setAudits] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const [auditsTemplate, setAuditsTemplate] = useState<any[]>([]);

  const [selectedAuditName, setSelectedAuditName] = useState("");
  const [selectedAuditId, setSelectedAuditId] = useState("");
  const [selectedAuditTypeId, setSelectedAuditTypeId] = useState("");
  const [selectedAuditOfferId, setSelectedAuditOfferId] = useState("");

  const [auditSearch, setAuditSearch] = useState("");
  const [auditTypeSearch, setAuditTypeSearch] = useState("");
  const [auditOfferSearch, setAuditOfferSearch] = useState("");

  const [suggestions, setSuggestions] = useState<any[]>([]);

  // ========================================================
  // Début BD / Récupération audits
  // ========================================================
  const fetchAudits = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("audit")
        .select(
          `
                    id,
                    auditname,
                    audittype (id, nameaudittype)
                `
        )
        .eq("template", false);

      if (error) {
        setFetchError(error.message);
        setAudits([]);
      } else {
        setAudits(data ?? []);
      }
    } catch (err) {
      setFetchError(err.message ?? "Erreur inconnue");
      setAudits([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAudits();
  }, []);

  // ========================================================
  // Récupération templates d'audits
  // ========================================================
  const fetchAuditsTemplate = async (value) => {
    setAuditSearch(value);

    const { data, error } = await supabase
      .from("audit")
      .select(
        `
                id,
                auditname,
                audittype:idaudittype (
                    id,
                    nameaudittype
                ),
                own (
                    theme:idtheme (
                        id,
                        themename,
                        question (
                            id,
                            label
                        )
                    )
                )
            `
      )
      .eq("template", true)
      .order("auditname");

    if (!error && data) {
      console.log("Tous les audits chargés:", data.length);
      const transformedData = data.map((audit) => ({
        id: audit.id,
        auditname: audit.auditname,
        audittype: audit.audittype,
        themes: audit.own?.map((o) => o.theme) || [],
      }));

      setAuditsTemplate(transformedData);
    }
  };

  useEffect(() => {
    fetchAuditsTemplate("");
  }, []);

  // ========================================================
  // Récupération d'audits type
  // ========================================================

  const fetchAuditsType = async (value) => {
    setAuditTypeSearch(value);

    const { data, error } = await supabase
      .from("audittype")
      .select(
        `
                id,
                nameaudittype
            `
      )
      .order("nameaudittype");

    if (!error && data) {
      console.log("Tous les types d'audits chargés:", data.length);
      const transformedData = data.map((audittype) => ({
        id: audittype.id,
        nameaudittype: audittype.nameaudittype,
      }));

      setAuditType(transformedData);
    }
  };

  useEffect(() => {
    fetchAuditsType("");
  }, []);

  // ========================================================
  // Récupération d'audits offer
  // ========================================================

  const fetchAuditsOffer = async (value) => {
    setAuditOfferSearch(value);

    const { data, error } = await supabase
      .from("auditoffer")
      .select(
        `
                id,
                nameauditoffer
            `
      )
      .order("nameauditoffer");

    if (!error && data) {
      console.log("Tous les offres d'audits chargées:", data.length);
      const transformedData = data.map((auditoffer) => ({
        id: auditoffer.id,
        nameauditoffer: auditoffer.nameauditoffer,
      }));

      setAuditOffer(transformedData);
    }
  };

  useEffect(() => {
    fetchAuditsOffer("");
  }, []);

  // ========================================================
  // Sélection d'un template d'audit
  // ========================================================
  const handleSelectAuditTemplate = (value: string) => {
    setAuditSearch(value);
    const selected = auditsTemplate.find((a) => a.auditname === value);
    if (selected) {
      setSelectedAuditId(selected.id);
      console.log("Audit sélectionné:", selected);
    } else {
      setSelectedAuditId("");
    }
  };

  useEffect(() => {
    if (auditsTemplate.length === 0 || !auditSearch) return;

    console.log("Vérification audit:", auditSearch);

    const selected = auditsTemplate.find(
      (a) =>
        a.auditname.toLowerCase().trim() === auditSearch.toLowerCase().trim()
    );

    if (selected) {
      console.log(
        "Audit trouvé et sélectionné:",
        selected.auditname,
        "ID:",
        selected.id
      );
      setSelectedAuditId(selected.id);
    } else {
      console.log("Aucun audit exact trouvé pour:", auditSearch);
    }
  }, [auditSearch, auditsTemplate]);

  // ========================================================
  // Sélection d'un audit type
  // ========================================================
  const handleSelectAuditType = (value: string) => {
    setAuditTypeSearch(value);
    const selected = auditType.find((a) => a.nameaudittype === value);
    if (selected) {
      setSelectedAuditTypeId(selected.id);
      console.log("Audit type sélectionné:", selected);
    } else {
      setSelectedAuditTypeId("");
    }
  };

  useEffect(() => {
    if (auditType.length === 0 || !auditTypeSearch) return;

    console.log("Vérification audit type:", auditTypeSearch);

    const selected = auditType.find(
      (a) =>
        a.nameaudittype.toLowerCase().trim() ===
        auditTypeSearch.toLowerCase().trim()
    );

    if (selected) {
      console.log(
        "Audit type trouvé et sélectionné:",
        selected.nameaudittype,
        "ID:",
        selected.id
      );
      setSelectedAuditTypeId(selected.id);
    } else {
      console.log("Aucun audit type exact trouvé pour:", auditTypeSearch);
    }
  }, [auditTypeSearch, auditType]);

  // ========================================================
  // Sélection d'un audit offer
  // ========================================================
  const handleSelectAuditOffer = (value: string) => {
    setAuditOfferSearch(value);
    const selected = auditOffer.find((a) => a.nameauditoffer === value);
    if (selected) {
      setSelectedAuditOfferId(selected.id);
      console.log("Audit offer sélectionné:", selected);
    } else {
      setSelectedAuditOfferId("");
    }
  };

  useEffect(() => {
    if (auditOffer.length === 0 || !auditOfferSearch) return;

    console.log("Vérification audit offer:", auditOfferSearch);

    const selected = auditOffer.find(
      (a) =>
        a.nameauditoffer.toLowerCase().trim() ===
        auditOfferSearch.toLowerCase().trim()
    );

    if (selected) {
      console.log(
        "Audit offer trouvé et sélectionné:",
        selected.nameauditoffer,
        "ID:",
        selected.id
      );
      setSelectedAuditOfferId(selected.id);
    } else {
      console.log("Aucun audit offer exact trouvé pour:", auditOfferSearch);
    }
  }, [auditOfferSearch, auditOffer]);

  // ========================================================
  // Récupération clients
  // ========================================================
  const fetchClients = async () => {
    try {
      const { data, error } = await supabase.from("client").select("*");

      if (error) {
        setFetchError(error.message);
        setClients([]);
      } else {
        setClients(data ?? []);
      }
    } catch (err) {
      setFetchError(err.message ?? "Erreur inconnue");
      setClients([]);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // ========================================================
  // Autocomplétion client
  // ========================================================
  const handleSearch = async (value) => {
    console.log("Recherche pour:", value);
    setClientLastName(value);

    if (value.length < 1) {
      setSuggestions([]);
      return;
    }

    const { data: handelsShearch, error: handelsShearchError } = await supabase
      .from("client")
      .select(`*`)
      .or(`clientlastname.ilike.%${value}%,clientfirstname.ilike.%${value}%`)
      .limit(10);

    if (handelsShearchError) {
      console.error("Erreur Supabase:", handelsShearchError);
      setSuggestions([]);
    } else {
      console.log("Résultats trouvés:", handelsShearch?.length, handelsShearch);
      if (handelsShearch && handelsShearch.length > 0) {
        console.log("Noms des colonnes:", Object.keys(handelsShearch[0]));
        console.log("Premier client complet:", handelsShearch[0]);
      }
      setSuggestions(handelsShearch || []);
    }
  };

  // ========================================================
  // Insert client + l'audit dans la base de donner
  // ========================================================
  async function handleCreateClient() {
    if (!validEmail.test(clientEmail)) {
      setMessage("Email invalide");
      return;
    }

    let checkCount = 0;

    // ========================================================
    // Vérifier si le client existe déjà
    // ========================================================

    const { data: existingClient } = await supabase
      .from("client")
      .select("*")
      .eq("clientlastname", clientLastName)
      .eq("clientfirstname", clientFirstName)
      .eq("clientemail", clientEmail);

    if (existingClient && existingClient.length > 0) {
      const client = existingClient[0];
      console.log("Client déjà existant :", client.id);
      checkCount += 1;
      return;
    }

    // ========================================================
    // Vérifier si l'audit existe déjà
    // ========================================================
    const auditNameToCheck = (auditSearch || "").trim();
    const { data: existingTemplate, error: existingTemplateError } =
      await supabase
        .from("audit")
        .select("*")
        .eq("template", true)
        .eq("auditname", auditNameToCheck)
        .limit(1);

    if (existingTemplate && existingTemplate.length > 0) {
      const audit = existingTemplate[0];
      console.log("Template d'audit déjà existant :", audit.id);
      checkCount += 1;
      return;
    }

    if (checkCount === 1) {
      console.log("Une seule condition est vraie");
    }

    if (checkCount === 2) {
      console.log("Les deux conditions sont vraies");
    }

    if (checkCount === 0) {
      console.log("Aucune condition n'est vraie");
    }

    // ========================================================
    // Insertion du nouveau client si template non choisie
    // ========================================================
    const { data: clientData, error: error } = await supabase
      .from("client")
      .insert([
        {
          clientlastname: clientLastName,
          clientfirstname: clientFirstName,
          clientemail: clientEmail,
          clientphone: clientPhone,
          companyname: companyName,
          clientaddress: clientAddress,
          clientcity: clientCity,
          clientcountry: clientCountry,
          siren: siren,
          vatnumber: vatNumber,
          businessactivity: businessActivity,
          rcsnumber: rcsNumber,
          sharecapital: shareCapital ? parseFloat(shareCapital) : null,
          socialnetworks: socialNetworks,
          legalform: legalForm,
          logo: logo || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Erreur insertion :", error);
      setMessage(`Erreur : ${error.message}`);
      return;
    }

    const insertedClientId = clientData?.id;
    console.log("Client inséré -> ID :", insertedClientId);

    const idauditofferValue = selectedAuditOfferId;
    const idaudittypeValue = selectedAuditTypeId;
    const nameAuditTemplate = selectedAuditName;

    const { data: auditData, error: auditError } = await supabase
      .from("audit")
      .insert([
        {
          idaudittype: idaudittypeValue,
          idauditoffer: idauditofferValue,
          idstatus: 1,
          auditname: nameAuditTemplate,
        },
      ])
      .select()
      .single();

    if (auditError) {
      console.error("Erreur insertion audit :", auditError);
      setMessage(`Erreur audit : ${auditError.message}`);
      return;
    }

    const insertedAuditId = auditData?.id;
    console.log("Client inséré -> ID :", insertedAuditId);

    const { data: auditParticipate, error: auditParticipateError } =
      await supabase
        .from("participate")
        .insert([
          {
            idclient: insertedClientId,
            idaudit: insertedAuditId,
            participationdate: new Date().toISOString().split("T")[0],
          },
        ])
        .select()
        .single();

    if (auditParticipateError) {
      console.error("Erreur insertion audit :", auditParticipateError);
      setMessage(`Erreur audit : ${auditParticipateError.message}`);
      return;
    }

    const createdId =
      Array.isArray(clientData) && (clientData as any).length > 0
        ? (clientData as any)[0].id
        : (clientData as any)?.id;
    console.log("Client créé :", { createdId, clientData });

    // Redirection
    setTimeout(() => {
      window.location.href = `/audit/${insertedAuditId}/edit`;
    }, 1500);
  }

  // ========================================================
  // Fin BD
  // ========================================================

  const handleSelectClient = (client: any) => {
    setClientLastName(client.clientlastname || "");
    setClientFirstName(client.clientfirstname || "");
    setClientEmail(client.clientemail || "");
    setClientPhone(client.clientphone || "");
    setCompanyName(client.companyname || "");
    setClientAddress(client.clientaddress || "");
    setClientCity(client.clientcity || "");
    setClientCountry(client.clientcountry || "");
    setSiren(client.siren || "");
    setVatNumber(client.vatnumber || "");
    setBusinessActivity(client.businessactivity || "");
    setRcsNumber(client.rcsnumber || "");
    setShareCapital(client.sharecapital || "");
    setSocialNetworks(client.socialnetworks || "");
    setLegalForm(client.legalform || "");
    setLogo(client.logo || "");
    setSuggestions([]);
  };

  useEffect(() => {
    if (suggestions.length === 0) return;

    console.log("Vérification sélection:", clientLastName);
    console.log("Suggestions disponibles:", suggestions);

    const client = suggestions.find((c) => {
      const fullName = `${c.clientlastname} ${c.clientfirstname}`;
      const match =
        fullName.toLowerCase().trim() === clientLastName.toLowerCase().trim();
      console.log(
        `   Comparaison: "${fullName}" === "${clientLastName}" ? ${match}`
      );
      return match;
    });

    if (client) {
      console.log("Client trouvé, remplissage des champs...");
      handleSelectClient(client);
    }
  }, [clientLastName, suggestions]);

  // ========================================================
  // Soumission du formulaire
  // ========================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      clientLastName,
      clientFirstName,
      clientEmail,
      clientPhone,
      companyName,
      clientAddress,
      clientCity,
      clientCountry,
      siren,
      vatNumber,
      businessActivity,
      rcsNumber,
      socialNetworks,
      legalForm,
      logo,
      nameAudit,
      auditType,
      auditOffer,
    };
    console.log("Créer client : ", payload);
    setError("");
    alert("client créé !");

    if (!validEmail.test(clientEmail)) {
      setMessage("Email invalide");
      return;
    }

    if (!validPhone.test(clientPhone)) {
      setMessage("Numéro de téléphone invalide");
      return;
    }
  };

  // ========================================================
  // Affichage
  // ========================================================
  return (
    <div className="new-client-audits">
      <h1 className="titre-new-audits">Création d'audit</h1>

      <form onSubmit={handleSubmit} className="new-audits-form">
        <div className="Client-info-name">
          <div className="new-field">
            <label htmlFor="client-last">Nom du client</label>
            <input
              className="new-input-style"
              list="client-list"
              value={clientLastName}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Ex: Dupont"
              autoComplete="off"
              required
            />
            <datalist id="client-list">
              {suggestions.map((c) => (
                <option
                  key={c.id}
                  value={`${c.clientlastname} ${c.clientfirstname}`}
                />
              ))}
            </datalist>
          </div>

          <div className="new-field">
            <label htmlFor="client-first">Prénom du client</label>
            <input
              className="new-input-style"
              value={clientFirstName}
              onChange={(e) => setClientFirstName(e.target.value)}
              placeholder="Ex: Jean"
              required
            />
          </div>
        </div>

        <div className="Client-info-adr">
          <div className="new-field">
            <label htmlFor="client-adr">adresse du client</label>
            <input
              className="new-input-style"
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
              placeholder="Ex: 37 Rue du Dolmen"
              required
            />
          </div>

          <div className="new-field">
            <label htmlFor="client-city">Ville du client</label>
            <input
              className="new-input-style"
              value={clientCity}
              onChange={(e) => setClientCity(e.target.value)}
              placeholder="Ex: Poitiers"
              required
            />
          </div>

          <div className="new-field">
            <label htmlFor="client-country">Pays du client</label>
            <input
              className="new-input-style"
              value={clientCountry}
              onChange={(e) => setClientCountry(e.target.value)}
              placeholder="Ex: France"
              required
            />
          </div>
        </div>

        <div className="Client-info-mail">
          <div className="new-field">
            <label htmlFor="client-email">Email du client</label>
            <input
              className="new-input-style"
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="ex@domaine.com"
              required
            />
          </div>
        </div>

        <div className="Client-info-contact">
          <div className="new-field">
            <label htmlFor="client-phone">Téléphone</label>
            <PhoneInput
              inputClassName="new-input-style"
              defaultCountry="fr"
              value={clientPhone}
              onChange={(value: string) => setClientPhone(value)}
            />
          </div>

          <div className="new-field">
            <label htmlFor="client-social-rcs">Numéro RCS</label>
            <input
              className="new-input-style"
              value={rcsNumber}
              onChange={(e) => setRcsNumber(e.target.value)}
              placeholder="Ex: RCS PARIS B 517 403 572"
            />
          </div>
        </div>

        <div className="Client-business-info">
          <div className="new-field">
            <label htmlFor="company-name">Nom de l'entreprise</label>
            <input
              className="new-input-style"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Ex: ACME SARL"
            />
          </div>

          <div className="new-field">
            <label htmlFor="business-activity">Domaine d'activité</label>
            <input
              className="new-input-style"
              value={businessActivity}
              onChange={(e) => setBusinessActivity(e.target.value)}
              placeholder="Ex: Informatique"
            />
          </div>

          <div className="new-field">
            <label htmlFor="business-shareCapital">capital social</label>
            <input
              className="new-input-style"
              value={shareCapital}
              onChange={(e) => setShareCapital(e.target.value)}
              placeholder="Ex: 1000000.00"
            />
          </div>
        </div>

        <div className="Client-business-legal">
          <div className="new-field">
            <label htmlFor="company-vat">Numéro de TVA</label>
            <input
              className="new-input-style"
              value={vatNumber}
              onChange={(e) => setVatNumber(e.target.value)}
              placeholder="Ex: FR12 345678901"
            />
          </div>

          <div className="new-field">
            <label htmlFor="client-social-legal">Forme juridique</label>
            <input
              className="new-input-style"
              value={legalForm}
              onChange={(e) => setLegalForm(e.target.value)}
              placeholder="SARL"
            />
          </div>
        </div>

        <div className="Client-business-img">
          <div className="new-field">
            <label htmlFor="business-activity">Siren</label>
            <input
              className="new-input-style"
              value={siren}
              onChange={(e) => setSiren(e.target.value)}
              placeholder="362 521 879 00034"
            />
          </div>

          <div className="new-field">
            <label htmlFor="business-activity">Logo de l'entreprise</label>
            <input
              className="new-input-style"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              placeholder="..."
            />
          </div>
        </div>

        <div className="Client-business-social">
          <div className="new-field">
            <label htmlFor="client-social-networks">Réseau social</label>
            <input
              className="new-input-style"
              value={socialNetworks}
              onChange={(e) => setSocialNetworks(e.target.value)}
              placeholder="Ex: Linkedin"
            />
          </div>
        </div>

        <div className="Client-audits-template">
          <div className="new-field">
            <label htmlFor="audits-name">Audits</label>
            <input
              className="new-input-style"
              list="audits-list"
              value={auditSearch}
              onChange={(e) => handleSelectAuditTemplate(e.target.value)}
              placeholder="Ex: Audit sécurité..."
              autoComplete="off"
            />

            <datalist id="audits-list">
              {auditsTemplate
                .filter(
                  (a) =>
                    auditSearch.length === 0 ||
                    a.auditname
                      .toLowerCase()
                      .includes(auditSearch.toLowerCase())
                )
                .map((a) => (
                  <option key={a.id} value={a.auditname} />
                ))}
            </datalist>
          </div>

          <div className="new-field">
            <label htmlFor="audits-type">Type d'audits</label>
            <input
              className="new-input-style"
              list="audittype-list"
              value={auditTypeSearch}
              onChange={(e) => handleSelectAuditType(e.target.value)}
              placeholder="Ex: Interne..."
              autoComplete="off"
              required
            />

            <datalist id="audittype-list">
              {auditType
                .filter(
                  (a) =>
                    auditTypeSearch.length === 0 ||
                    a.nameaudittype
                      .toLowerCase()
                      .includes(auditTypeSearch.toLowerCase())
                )
                .map((a) => (
                  <option key={a.id} value={a.nameaudittype} />
                ))}
            </datalist>
          </div>

          <div className="new-field">
            <label htmlFor="audits-offer">Offres d'audits</label>
            <input
              className="new-input-style"
              list="auditoffer-list"
              value={auditOfferSearch}
              onChange={(e) => handleSelectAuditOffer(e.target.value)}
              placeholder="Ex: Express..."
              autoComplete="off"
              required
            />

            <datalist id="auditoffer-list">
              {auditOffer
                .filter(
                  (a) =>
                    auditOfferSearch.length === 0 ||
                    a.nameauditoffer
                      .toLowerCase()
                      .includes(auditOfferSearch.toLowerCase())
                )
                .map((a) => (
                  <option key={a.id} value={a.nameauditoffer} />
                ))}
            </datalist>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="new-audits-btn"
            onClick={handleCreateClient}
          >
            Créer
          </button>
          <a href="/audits" className="new-audits-btn">
            Annuler
          </a>
        </div>

        {message && <p className="form-message">{message}</p>}
        {error && <p className="form-message">{error}</p>}
      </form>
    </div>
  );
}
