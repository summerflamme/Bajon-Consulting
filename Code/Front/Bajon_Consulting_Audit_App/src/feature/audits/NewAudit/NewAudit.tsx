import { useState, useEffect } from "react";
import "../components/NewAudit.css";
import { supabase } from "../../../supabaseClient";

export default function NewAuditPage() {
    // ========================================================
    // formulaire
    // ========================================================

    const [nameAudit, setNameAudit] = useState("");
    const [name, setName] = useState("");
    const [clientFirstName, setClientFirstName] = useState("");
    const [clientLastName, setClientLastName] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [clientPhone, setClientPhone] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [siren, setSiren] = useState("");
    const [error, setError] = useState("");

    // ========================================================
    // BD
    // ========================================================

    const [audits, setAudits] = useState([]);
    const [auditsTemplate, setAuditsTemplate] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const [selectedAuditId, setSelectedAuditId] = useState("");

    const [suggestions, setSuggestions] = useState([]);

    const [auditSearch, setAuditSearch] = useState("");
    const [auditSuggestions, setAuditSuggestions] = useState([]);

    // ========================================================
    // SQL audits
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
          audittype (
            id,
            nameaudittype
          )
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
    // SQL templates d’audits
    // ========================================================

    const fetchAuditsTemplate = async (value) => {
        setAuditSearch(value);
        if (value.length === 0) {
            const { data, error } = await supabase
                .from("audit")
                .select(`id,
                 auditname`
                )
            if (!error && data) {
                setAuditSuggestions(data);
            }
            return;
        }
        const { data, error } = await supabase
            .from("audit")
            .select(`id, 
                         auditname`)
            .ilike("auditname",
                `%${value}%`)

        if (!error && data) {
            setAuditSuggestions(data);
        }
    };

    useEffect(() => {
        fetchAuditsTemplate("");
    }, []);

    // ========================================================
    // recherche clients
    // ========================================================

    const fetchClients = async () => {
        try {
            const { data, error } = await supabase
                .from("client")
                .select("*");

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
    // autocomplétion client
    // ========================================================

    const handleSearch = async (value) => {
        setClientLastName(value);

        if (value.length < 1) {
            setSuggestions([]);
            return;
        }

        const { data, error } = await supabase
            .from("client")
            .select(
                "id, clientfirstname, clientlastname, clientemail, clientphone, companyname, siren"
            )
            .ilike("clientlastname", `%${value}%`)
            .limit(10);

        if (!error && data) {
            setSuggestions(data);
        }
    };

    const handleSelectClient = (client) => {
        setClientFirstName(client.clientfirstname || "");
        setClientLastName(client.clientlastname || "");
        setClientEmail(client.clientemail || "");
        setClientPhone(client.clientphone || "");
        setCompanyName(client.companyname || "");
        setSiren(client.siren || "");
    };

    useEffect(() => {
        const client = suggestions.find(
            (c) =>
                `${c.clientlastname} ${c.clientfirstname}`.toLowerCase() ===
                clientLastName.toLowerCase()
        );
        if (client) handleSelectClient(client);
    }, [clientLastName]);


    // ========================================================
    // Soumission du formulaire
    // ========================================================

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            nameAudit,
            name,
            clientFirstName,
            clientLastName,
            clientEmail,
            clientPhone,
            companyName,
            siren,
        };
        console.log("Créer client : ", payload);
        setError("");
        alert("client créé !");
    };

    // ========================================================
    // Affichage
    // ========================================================

    return (
        <div className="test">
            <h2>Créer un audit</h2>

            <form onSubmit={handleSubmit} className="new-audit-form">
                <label htmlFor="audit-name">Nom de l'audit</label>
                <input
                    id="audit-search"
                    list="audit-list"
                    value={auditSearch}
                    onChange={(e) => fetchAuditsTemplate(e.target.value)}
                    placeholder="Ex: Audit sécurité..."
                    autoComplete="off"
                    required
                />

                <datalist id="audit-list">
                    {auditSuggestions.map((a) => (
                        <option key={a.id} value={a.auditname} />
                    ))}
                </datalist>

                <label htmlFor="client-last">Nom du client</label>
                <input
                    id="client-last"
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

                <label htmlFor="client-first">Prénom du client</label>
                <input
                    id="client-first"
                    value={clientFirstName}
                    onChange={(e) => setClientFirstName(e.target.value)}
                    placeholder="Ex: Jean"
                    required
                />

                <label htmlFor="client-email">Email du client</label>
                <input
                    id="client-email"
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="ex@domaine.com"
                    required
                />

                <label htmlFor="client-phone">Téléphone</label>
                <input
                    id="client-phone"
                    type="tel"
                    inputMode="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+33 6 12 34 56 78"
                    pattern="[0-9+()\s\-]{6,20}"
                />

                <label htmlFor="company-name">Nom de l'entreprise</label>
                <input
                    id="company-name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Ex: ACME SARL"
                />

                <label htmlFor="siren">SIREN</label>
                <input
                    id="siren"
                    value={siren}
                    onChange={(e) => setSiren(e.target.value)}
                    placeholder="9 chiffres"
                    pattern="\d{9}"
                />

                <div className="form-actions">
                    <button type="submit">Créer</button>
                    <button type="button" onClick={() => window.history.back()}>
                        Annuler
                    </button>
                </div>

                {error && <p className="form-message">{error}</p>}
            </form>
        </div>
    );
}