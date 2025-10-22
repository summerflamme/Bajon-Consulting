import { useState, useEffect } from "react";
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import "./NewAudit.css";
import { supabase } from "../../../supabaseClient";

export default function NewAuditPage() {

    const [nameAudit, setNameAudit] = useState("");
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

    const [message, setMessage] = useState('');
    const validEmail = new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$');
    const validPhone = new RegExp('^(\\+33|0)[1-9](\\d{2}){4}$');

    const [audits, setAudits] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);

    const [auditsTemplate, setAuditsTemplate] = useState<any[]>([]);
    const [selectedAuditId, setSelectedAuditId] = useState("");
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [auditSearch, setAuditSearch] = useState("");

    // ========================================================
    // Récupération audits
    // ========================================================
    const fetchAudits = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("audit")
                .select(`
                    id,
                    auditname,
                    audittype (id, nameaudittype)
                `)
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
    // Récupération templates d’audits
    // ========================================================
    const fetchAuditsTemplate = async (value) => {
        setAuditSearch(value);
        if (value.length === 0) {
            const { data, error } = await supabase
                .from("audit")
                .select(`id, auditname`)
                .eq("template", true);
            if (!error && data) {
                setAuditsTemplate(data);
            }
            return;
        }
        const { data, error } = await supabase
            .from("audit")
            .select(`
            id,
            auditname,
            audittype:idaudittype (
                id,
                nameaudittype
            ),
            own!inner (
                theme:idtheme (
                    id,
                    themename,
                    question (
                        id,
                        label
                    )
                )
            )
        `)
            .eq("template", true)
            .ilike("auditname", `%${value}%`);

        if (!error && data) {
            const transformedData = data.map(audit => ({
                id: audit.id,
                auditname: audit.auditname,
                audittype: audit.audittype,
                themes: audit.own?.map(o => o.theme) || []
            }));

            setAuditsTemplate(transformedData);
        }
    };

    useEffect(() => {
        fetchAuditsTemplate("");
    }, []);
    // ========================================================
    // Sélection d’un template d’audit
    // ========================================================
    const handleSelectAuditTemplate = (value: string) => {
        setAuditSearch(value);
        const selected = auditsTemplate.find(a => a.auditname === value);
        if (selected) {
            setSelectedAuditId(selected.id);
        } else {
            setSelectedAuditId("");
        }
    };

    // ========================================================
    // Récupération clients
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
    // Autocomplétion client
    // ========================================================
    const handleSearch = async (value) => {
        setClientLastName(value);

        if (value.length < 1) {
            setSuggestions([]);
            return;
        }

        const { data, error } = await supabase
            .from("client")
            .select(`
                id, 
                clientlastname, 
                clientfirstname, 
                clientemail, 
                clientphone, 
                companyname, 
                clientAddress, 
                clientCity,
                clientCountry, 
                siren, 
                vatNumber, 
                businessActivity, 
                rcsNumber, 
                shareCapital, 
                socialNetworks, 
                legalForm, 
                logo
            `)
            .ilike("clientlastname", `%${value}%`)
            .limit(10);

        if (!error && data) {
            setSuggestions(data);
        }
    };

    const handleSelectClient = (client) => {
        setClientLastName(client.clientlastname || "");
        setClientFirstName(client.clientfirstname || "");
        setClientEmail(client.clientemail || "");
        setClientPhone(client.clientphone || "");
        setCompanyName(client.companyname || "");
        setClientAddress(client.clientAddress || "");
        setClientCity(client.clientCity || "");
        setClientCountry(client.clientCountry || "");
        setSiren(client.siren || "");
        setVatNumber(client.vatNumber || "");
        setBusinessActivity(client.businessActivity || "");
        setRcsNumber(client.rcsNumber || "");
        setShareCapital(client.shareCapital || "");
        setSocialNetworks(client.socialNetworks || "");
        setLegalForm(client.legalForm || "");
        setLogo(client.logo || "");
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
        <div className="new-audits">
            <h2 className="titre-new-audits">Créer un audit</h2>

            <form onSubmit={handleSubmit} className="new-audits-form">
                <div className="Client-info-name">
                    <div className="field">
                        <label htmlFor="client-last">Nom du client</label>
                        <input
                            className="input-style"
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

                    <div className="field">
                        <label htmlFor="client-first">Prénom du client</label>
                        <input
                            className="input-style"
                            value={clientFirstName}
                            onChange={(e) => setClientFirstName(e.target.value)}
                            placeholder="Ex: Jean"
                            required
                        />
                    </div>
                </div>

                <div className="Client-info-adr">
                    <div className="field">
                        <label htmlFor="client-adr">adresse du client</label>
                        <input
                            className="input-style"
                            value={clientAddress}
                            onChange={(e) => setClientAddress(e.target.value)}
                            placeholder="Ex: 37 Rue du Dolmen"
                            required
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="client-city">Ville du client</label>
                        <input
                            className="input-style"
                            value={clientCity}
                            onChange={(e) => setClientCity(e.target.value)}
                            placeholder="Ex: Poitiers"
                            required
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="client-country">Pays du client</label>
                        <input
                            className="input-style"
                            value={clientCountry}
                            onChange={(e) => setClientCountry(e.target.value)}
                            placeholder="Ex: France"
                            required
                        />
                    </div>
                </div>

                <div className="Client-info-contact">
                    <div className="field">
                        <label htmlFor="client-email">Email du client</label>
                        <input
                            className="input-style"
                            type="email"
                            value={clientEmail}
                            onChange={(e) => setClientEmail(e.target.value)}
                            placeholder="ex@domaine.com"
                            required
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="client-phone">Téléphone</label>
                        <PhoneInput
                            inputClassName="input-style"
                            defaultCountry="fr"
                            value={clientPhone}
                            onChange={(value: string) => setClientPhone(value)}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="client-social-networks">Réseau social</label>
                        <input
                            className="input-style"
                            value={socialNetworks}
                            onChange={(e) => setSocialNetworks(e.target.value)}
                            placeholder="Ex: Linkedin"
                        />
                    </div>
                </div>

                <div className="business-info">
                    <div className="field">
                        <label htmlFor="company-name">Nom de l'entreprise</label>
                        <input
                            className="input-style"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="Ex: ACME SARL"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="business-activity">Domaine d'activité</label>
                        <input
                            className="input-style"
                            value={businessActivity}
                            onChange={(e) => setBusinessActivity(e.target.value)}
                            placeholder="Informatique"
                        />
                    </div>
                </div>

                <div className="business-info">
                    <div className="field">
                        <label htmlFor="siren">SIREN</label>
                        <input
                            className="input-style"
                            value={siren}
                            onChange={(e) => setSiren(e.target.value)}
                            placeholder="9 chiffres"
                            pattern="\\d{9}"
                        />
                    </div>
                </div>

                <div className="audits-template">
                    <div className="field">
                        <label htmlFor="audits-name">Template audits</label>
                        <input
                            className="input-style"
                            list="audits-list"
                            value={auditSearch}
                            onChange={(e) => {
                                fetchAuditsTemplate(e.target.value);
                                handleSelectAuditTemplate(e.target.value);
                            }}
                            placeholder="Ex: Audit sécurité..."
                            autoComplete="off"
                            required
                        />

                        <datalist id="audits-list">
                            {auditsTemplate.map((a) => (
                                <option key={a.id} value={a.auditname} />
                            ))}
                        </datalist>
                    </div>
                </div>

                <div className="form-actions">
                    <a href="/audit" className="new-audits-btn">Créer</a>
                    <a href="/audits" className="new-audits-btn">Annulé</a> 
                </div>

                {error && <p className="form-message">{error}</p>}
            </form>

            {/* Test en court */}

            {selectedAuditId && (
                <div className="audit-list">
                    {auditsTemplate
                        .filter((a) => a.id === selectedAuditId)
                        .map((a) => (
                            <div key={a.id} className="audit-card">
                                <h3>{a.auditname}</h3>

                                {a.audittype && (
                                    <p><strong>Type :</strong> {a.audittype.nameaudittype}</p>
                                )}

                                <div className="themes">
                                    <strong><h4>Thèmes et Questions :</h4></strong>
                                    {a.themes && a.themes.length > 0 ? (
                                        a.themes.map((theme: any) => (
                                            <div key={theme.id}>
                                                <p> {theme.themename}</p>
                                                {theme.question && theme.question.length > 0 ? (
                                                    <ul>
                                                        {theme.question.map((q: any) => (
                                                            <li key={q.id}>{q.label}</li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p>Aucune question</p>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p>Aucun thème trouvé</p>
                                    )}
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}
