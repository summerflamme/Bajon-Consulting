import React, { useState, useEffect } from "react";
import "../components/NewAudit.css";
import { supabase } from "../supabaseClient";

export default function NewAuditPage() {
    // Simpler state: only essential fields for now
    const [name, setName] = useState("");
    const [clientFirstName, setClientFirstName] = useState("");
    const [clientLastName, setClientLastName] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [clientPhone, setClientPhone] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [siren, setSiren] = useState("");
    const [error, setError] = useState("");

    // test de recherche BD ---------------------------------------------
    const [audits, setAudits] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    // ------------------------------------------------------------------

    const fetchAudits = async () => {
        try {
            const { data, error } = await supabase
                .from("client")
                .select("*");

            if (error) {
                setFetchError(error.message);
                setAudits([]);
            } else {
                setAudits(data ?? []);
            }
        } catch (err: any) {
            setFetchError(err.message ?? "Erreur inconnue");
            setAudits([]);
        } 
        setLoading(false);
        
    };

    useEffect(() => {
        fetchAudits();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { name, clientFirstName, clientLastName, clientEmail, clientPhone, companyName, siren };
        console.log("Créer audit : ", payload);
        setError("");
        alert('Audit créé');
    };

    return (
        
        <div className="test">
            <h2>Test</h2>
            <form onSubmit={handleSubmit} className="new-audit-form">
                <label htmlFor="audit-name">Nom de l'audit</label>
                <input id="audit-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Audit sécurité" required />

                <label htmlFor="client-first">Prénom du client</label>
                <input id="client-first" value={clientFirstName} onChange={(e) => setClientFirstName(e.target.value)} placeholder="Ex: Jean" required />

                <label htmlFor="client-last">Nom du client</label>
                <input id="client-last" value={clientLastName} onChange={(e) => setClientLastName(e.target.value)} placeholder="Ex: Dupont" required />

                <label htmlFor="client-email">Email du client</label>
                <input id="client-email" type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="ex@domaine.com" required />

                <label htmlFor="client-phone">Téléphone</label>
                <input id="client-phone" type="tel" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="+33 6 12 34 56 78" pattern="[0-9+()\s\-]{6,20}" />

                <label htmlFor="company-name">Nom de l'entreprise</label>
                <input id="company-name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Ex: ACME SARL" />

                <label htmlFor="siren">SIREN</label>
                <input id="siren" value={siren} onChange={(e) => setSiren(e.target.value)} placeholder="9 chiffres" pattern="\\d{9}" />

                <div className="form-actions">
                    <button type="submit">Créer</button>
                    <button type="button" onClick={() => window.history.back()}>Annuler</button>
                </div>

                {error && <p className="form-message">{error}</p>}
            </form>
            
            <div style={{ display: 'grid', gap: 8, marginBottom: 20 }}>
                {audits.map((a: any) => (
                    <div key={a.id} style={{ border: '1px solid #ddd', padding: 8, borderRadius: 6, textAlign: 'left' }}>
                        <strong>{a.clientlastname}</strong><br/>
                        <strong>{a.clientfirstname ?? "Audit sans titre"}</strong>
                    </div>
                ))}
            </div>
        </div>
    );
}