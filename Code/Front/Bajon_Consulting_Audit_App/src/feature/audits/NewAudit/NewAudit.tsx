import { useState, useEffect } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import "./NewAudit.css";
import { supabase } from "../../../supabaseClient";
import { useLocation } from "react-router-dom";

export default function NewAuditPage() {
  // ========================================================
  // Setup
  // ========================================================

  // partie form client
  const [nameAudit, setNameAudit] = useState("");
  const [selectedAuditId, setSelectedAuditId] = useState("");
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

  // partie erreur
  const [auditTypeError, setAuditTypeError] = useState("");
  const [auditOfferError, setAuditOfferError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [auditTypeErrorMessage, setAuditTypeErrorMessage] = useState<
    string | null
  >(null);
  const [auditOfferErrorMessage, setAuditOfferErrorMessage] = useState<
    string | null
  >(null);
  const [emailErrorMessage, setEmailErrorMessage] = useState<string | null>(
    null
  );
  const [phoneErrorMessage, setPhoneErrorMessage] = useState<string | null>(
    null
  );

  // partie sécuriter
  const [message, setMessage] = useState("");
  const validEmail = new RegExp(
    "^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$"
  );
  const validPhone = new RegExp("^(\\+33|0)[1-9](\\d{2}){4}$");

  // partie form audit
  const [audits, setAudits] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const [auditsTemplate, setAuditsTemplate] = useState<any[]>([]);
  const [selectedAuditTypeId, setSelectedAuditTypeId] = useState("");
  const [selectedAuditOfferId, setSelectedAuditOfferId] = useState("");

  const [auditSearch, setAuditSearch] = useState("");
  const [auditTypeSearch, setAuditTypeSearch] = useState("");
  const [auditOfferSearch, setAuditOfferSearch] = useState("");

  const [suggestions, setSuggestions] = useState<any[]>([]);

  // partie diff audits/templates
  const location = useLocation();
  const isTemplateMode =
    new URLSearchParams(location.search).get("mode") === "template";

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
    } else {
      setSelectedAuditId("");
    }
  };

  useEffect(() => {
    if (auditsTemplate.length === 0 || !auditSearch) return;

    const selected = auditsTemplate.find(
      (a) =>
        a.auditname.toLowerCase().trim() === auditSearch.toLowerCase().trim()
    );

    if (selected) {
      setSelectedAuditId(selected.id);
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
      setAuditTypeError(false);
    } else {
      setSelectedAuditTypeId("");
    }
  };

  useEffect(() => {
    if (auditType.length === 0 || !auditTypeSearch) return;

    const selected = auditType.find(
      (a) =>
        a.nameaudittype.toLowerCase().trim() ===
        auditTypeSearch.toLowerCase().trim()
    );

    if (selected) {
      setSelectedAuditTypeId(selected.id);
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
      setAuditOfferError(false);
    } else {
      setSelectedAuditOfferId("");
    }
  };

  useEffect(() => {
    if (auditOffer.length === 0 || !auditOfferSearch) return;

    const selected = auditOffer.find(
      (a) =>
        a.nameauditoffer.toLowerCase().trim() ===
        auditOfferSearch.toLowerCase().trim()
    );

    if (selected) {
      setSelectedAuditOfferId(selected.id);
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
      setSuggestions(handelsShearch || []);
    }
  };

  // ======================================================================================================
  // Soumission du formulaire avec Insertion client + l'audit dans la base de donner
  // ======================================================================================================
  async function handleCreateClient() {
    let clientExiste: boolean = false;
    let isTemplate: boolean = false;

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
      clientExiste = true;
    }

    // ========================================================
    // Vérifier si l'audit existe déjà
    // ========================================================
    const auditNameToCheck = (auditSearch || "").trim();
    const { data: existingTemplate } = await supabase
      .from("audit")
      .select("*")
      .eq("template", true)
      .eq("auditname", auditNameToCheck)
      .limit(1);

    if (existingTemplate && existingTemplate.length > 0) {
      const audit = existingTemplate[0];
      isTemplate = true;
    }

    const clientExistant = clientExiste === true;
    const templateExistant = isTemplate === true;

    const idauditofferValue = selectedAuditOfferId;
    const idaudittypeValue = selectedAuditTypeId;

    const auditNameFromForm = auditSearch.trim();

    // ========================================================
    // vérification audit type et audit offer
    // ========================================================
    if (!selectedAuditTypeId && !selectedAuditOfferId) {
      setAuditTypeErrorMessage("Le type d’audit saisi n’existe pas");
      setAuditOfferErrorMessage("L’offre d’audit saisi n’existe pas");
      setAuditTypeError(true);
      setAuditOfferError(true);
      return;
    } else if (!selectedAuditTypeId) {
      setAuditTypeErrorMessage("Le type d’audit saisi n’existe pas");
      setAuditTypeError(true);
      setAuditOfferError(false);
      return;
    } else if (!selectedAuditOfferId) {
      setAuditOfferErrorMessage("L’offre d’audit saisi n’existe pas");
      setAuditOfferError(true);
      setAuditTypeError(false);
      return;
    } else {
      setAuditTypeError(false);
      setAuditOfferError(false);
    }

    // ========================================================
    // vérification email
    // ========================================================
    if (!isTemplateMode) {
      if (!validEmail.test(clientEmail)) {
        setEmailErrorMessage("Email invalide");
        setEmailError(true);
        return;
      }
      setEmailError(false);
    }

    if (!isTemplateMode) {
      if (!validPhone.test(clientPhone)) {
        setPhoneErrorMessage("Numéro de téléphone invalide");
        setPhoneError(true);
        return;
      }
      setPhoneError(false);
    }

    // ========================================================
    // Condition pour les insert
    // ========================================================
    
    if (isTemplateMode) {
      const { data: auditData} = await supabase
        .from("audit")
        .insert([
          {
            idaudittype: idaudittypeValue,
            idauditoffer: idauditofferValue,
            idstatus: 1,
            auditname: auditNameFromForm,
            template: true,
          },
        ])
        .select()
        .single();

      const insertedAuditId = auditData.id;

      // Redirection
      setTimeout(() => {
        window.location.href = `/audit/${insertedAuditId}/edit`;
      }, 1500);
      return;
    } else if (clientExistant && !templateExistant) {
      // ========================================================
      // récupération du client existant
      // ========================================================
      const existingClientId = existingClient[0].id;

      // ========================================================
      // insert table audit
      // ========================================================
      const { data: auditData } = await supabase
        .from("audit")
        .insert([
          {
            idaudittype: idaudittypeValue,
            idauditoffer: idauditofferValue,
            idstatus: 1,
            auditname: auditNameFromForm,
            template: false,
          },
        ])
        .select()
        .single();

      const insertedAuditId = auditData.id;

      // ========================================================
      // insert table participer
      // ========================================================
      const {} = await supabase.from("participate").insert([
        {
          idclient: existingClientId,
          idaudit: insertedAuditId,
          participationdate: new Date().toISOString().split("T")[0],
        },
      ]);

      // Redirection
      setTimeout(() => {
        window.location.href = `/audit/${insertedAuditId}/edit`;
      }, 1500);
      return;
    } else if (!clientExistant && templateExistant) {
      // ========================================================
      // récupération du template existant
      // ========================================================
      const existingTemplateId = existingTemplate[0].id;

      // ========================================================
      // insert table client
      // ========================================================
      const { data: clientData } = await supabase
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

      const insertedClientId = clientData?.id;

      // ========================================================
      // insert table audit
      // ========================================================
      const { data: auditData } = await supabase
        .from("audit")
        .insert([
          {
            idaudittype: idaudittypeValue,
            idauditoffer: idauditofferValue,
            idstatus: 1,
            auditname: auditNameFromForm,
            template: false,
          },
        ])
        .select()
        .single();

      const insertedAuditId = auditData?.id;

      // ========================================================
      // recherche de idtheme dans la table own
      // ========================================================
      const { data: templateThemes } = await supabase
        .from("own")
        .select("idtheme")
        .eq("idaudit", existingTemplateId);

      // ========================================================
      // insert table own
      // ========================================================
      for (const theme of templateThemes) {
        if (!theme.idtheme) continue;
        const { error: ownError } = await supabase
          .from("own")
          .insert([
            {
              idaudit: insertedAuditId,
              idtheme: theme.idtheme,
            },
          ])
          .select()
          .single();

        if (ownError) {
          console.error(
            "Erreur insertion Own pour le thème :",
            theme.idtheme,
            ownError
          );
        }
      }

      // ========================================================
      // insert table participer
      // ========================================================
      const {} = await supabase
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

      // Redirection
      setTimeout(() => {
        window.location.href = `/audit/${insertedAuditId}/edit`;
      }, 1500);
      return;
    } else if (clientExistant && templateExistant) {
      console.log("c'est crée");

      // ========================================================
      // récupération du client existant
      // ========================================================
      const existingClientId = existingClient[0].id;

      // ========================================================
      // récupération du template existant
      // ========================================================
      const existingTemplateId = existingTemplate[0].id;

      // ========================================================
      // insert table audit
      // ========================================================
      const { data: auditData } = await supabase
        .from("audit")
        .insert([
          {
            idaudittype: idaudittypeValue,
            idauditoffer: idauditofferValue,
            idstatus: 1,
            auditname: auditNameFromForm,
            template: false,
          },
        ])
        .select()
        .single();

      const insertedAuditId = auditData.id;

      // ========================================================
      // recherche de idtheme dans la table own
      // ========================================================
      const { data: templateThemes } = await supabase
        .from("own")
        .select("idtheme")
        .eq("idaudit", existingTemplateId);

      // ========================================================
      // insert table own
      // ========================================================
      for (const theme of templateThemes) {
        if (!theme.idtheme) continue;
        const { error: ownError } = await supabase
          .from("own")
          .insert([
            {
              idaudit: insertedAuditId,
              idtheme: theme.idtheme,
            },
          ])
          .select()
          .single();

        if (ownError) {
          console.error(
            "Erreur insertion Own pour le thème :",
            theme.idtheme,
            ownError
          );
        }
      }

      // ========================================================
      // insert table participer
      // ========================================================
      const {} = await supabase.from("participate").insert([
        {
          idclient: existingClientId,
          idaudit: insertedAuditId,
          participationdate: new Date().toISOString().split("T")[0],
        },
      ]);

      // Redirection
      setTimeout(() => {
        window.location.href = `/audit/${insertedAuditId}/edit`;
      }, 1500);
      return;
    } else if (!clientExistant && !templateExistant) {
      // ========================================================
      // insert table client
      // ========================================================
      const { data: clientData } = await supabase
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

      const insertedClientId = clientData?.id;
      const auditNameFromForm = auditSearch.trim();

      // ========================================================
      // insert table audit
      // ========================================================
      const { data: auditData } = await supabase
        .from("audit")
        .insert([
          {
            idaudittype: idaudittypeValue,
            idauditoffer: idauditofferValue,
            idstatus: 1,
            auditname: auditNameFromForm,
            template: false,
          },
        ])
        .select()
        .single();

      const insertedAuditId = auditData?.id;

      // ========================================================
      // insert table participer
      // ========================================================
      const {} = await supabase
        .from("participate")
        .insert([
          {
            idclient: existingClientId,
            idaudit: insertedAuditId,
            participationdate: new Date().toISOString().split("T")[0],
          },
        ]);
      
      // Redirection
      setTimeout(() => {
        window.location.href = `/audit/${insertedAuditId}/edit`;
      }, 1500);
    }

    if (!clientExistant && !templateExistant) {
      console.log("!clientExistant = false && !templateExistant = false");

      // ========================================================
      // insert table client
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

      // Redirection
      setTimeout(() => {
        window.location.href = `/audit/${insertedAuditId}/edit`;
      }, 1500);
      return;
    }
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

    const client = suggestions.find((c) => {
      const fullName = `${c.clientlastname} ${c.clientfirstname}`;
      const match =
        fullName.toLowerCase().trim() === clientLastName.toLowerCase().trim();
      return match;
    });

    if (client) {
      handleSelectClient(client);
    }
  }, [clientLastName, suggestions]);

  // ========================================================
  // Affichage
  // ========================================================
  return (
    <div className="new-client-audits">
      <h1 className="titre-new-audits">Création {`${!isTemplateMode ? "d'audit" : "de template"}`}</h1>

      <form className="new-audits-form">
        {!isTemplateMode && (
          <>
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
                  required={!isTemplateMode}
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
                  required={!isTemplateMode}
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
                  required={!isTemplateMode}
                />
              </div>

              <div className="new-field">
                <label htmlFor="client-city">Ville du client</label>
                <input
                  className="new-input-style"
                  value={clientCity}
                  onChange={(e) => setClientCity(e.target.value)}
                  placeholder="Ex: Poitiers"
                  required={!isTemplateMode}
                />
              </div>

              <div className="new-field">
                <label htmlFor="client-country">Pays du client</label>
                <input
                  className="new-input-style"
                  value={clientCountry}
                  onChange={(e) => setClientCountry(e.target.value)}
                  placeholder="Ex: France"
                  required={!isTemplateMode}
                />
              </div>
            </div>

            <div className="Client-info-mail">
              <div className={`new-field ${emailError ? "field-error" : ""}`}>
                <label htmlFor="client-email">Email du client</label>
                <input
                  type="email"
                  className="new-input-style"
                  value={clientEmail}
                  onChange={(e) => {
                    setClientEmail(e.target.value);
                    setEmailErrorMessage("");
                  }}
                  placeholder="ex@domaine.com"
                  required={!isTemplateMode}
                />

                {emailError && (
                  <span className="error-tooltip">{emailError}</span>
                )}
              </div>
            </div>

            <div className="Client-info-contact">
              <div className={`new-field ${phoneError ? "field-error" : ""}`}>
                <label htmlFor="client-phone">Téléphone</label>
                <PhoneInput
                  inputClassName="new-input-style"
                  defaultCountry="fr"
                  value={clientPhone}
                  onChange={(value: string) => {
                    setClientPhone(value);
                    setPhoneError(false);
                    setPhoneErrorMessage(null);
                  }}
                />

                {phoneError && (
                  <span className="error-tooltip">{phoneErrorMessage}</span>
                )}
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
          </>
        )}

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
            {!isTemplateMode && (
              <datalist id="audits-list">
                {auditsTemplate.map((a) => (
                  <option key={a.id} value={a.auditname} />
                ))}
              </datalist>
            )}
          </div>

          <div className={`new-field ${auditTypeError ? "field-error" : ""}`}>
            <label htmlFor="audits-type">Type d'audit</label>

            <select
              id="audits-type"
              // ne suis pas sur
              className={`new-input-style ${
                selectedAuditTypeId === "" ? "select-placeholder" : ""
              }`}
              value={selectedAuditTypeId}
              onChange={(e) => {
                setSelectedAuditTypeId(e.target.value);
                setAuditTypeError(false);
                setAuditTypeErrorMessage("");
              }}
              required
            >
              <option value="" disabled hidden className="test">
                {" "}
                Sélection d'un type d’audit{" "}
              </option>
              {auditType.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nameaudittype}
                </option>
              ))}
            </select>

            {auditTypeError && (
              <span className="error-tooltip">{auditTypeErrorMessage}</span>
            )}
          </div>

          <div className={`new-field ${auditOfferError ? "field-error" : ""}`}>
            <label htmlFor="audits-offer">Offre d'audit</label>

            <select
              id="audits-offer"
              // ne suis pas sur
              className={`new-input-style ${
                selectedAuditOfferId === "" ? "select-placeholder" : ""
              }`}
              value={selectedAuditOfferId}
              onChange={(e) => {
                setSelectedAuditOfferId(e.target.value);
                setAuditOfferError(false);
                setAuditOfferErrorMessage("");
              }}
              required
            >
              <option value="" disabled hidden>
                {" "}
                Sélection d'une offre d’audit{" "}
              </option>
              {auditOffer.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nameauditoffer}
                </option>
              ))}
            </select>

            {auditOfferError && (
              <span className="error-tooltip">{auditOfferErrorMessage}</span>
            )}
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
