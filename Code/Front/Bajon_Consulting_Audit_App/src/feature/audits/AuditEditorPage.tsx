import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import AuditForm from "./AuditForm/AuditForm";
import type { Audit, Response, Section } from "../../types/audit";
import "./AuditForm/AuditStyle.css";
import { supabase } from "@/supabaseClient";

type Props = {
    auditData?: Audit;
    mode: "edit" | "view";
};

function AuditEditorPage({ auditData, mode = "view" }: Props) {
    const params = useParams();
    const routeId = params.id ? parseInt(params.id, 10) : undefined;

    const [data, setData] = useState<Section[]>([]);
    const [initialResponses, setInitialResponses] = useState<Response[]>([]);
    const [updatedResponses, setUpdatedResponses] = useState<Response[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // --- Récupération des données d’audit ---
    const fetchAuditData = useCallback(async (id?: number) => {
        if (!id) return;
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.rpc("get_audit_data", { _idaudit: id });
        setLoading(false);

        if (error) {
            console.error("Erreur chargement audit :", error);
            setError(error.message);
        } else {
            console.log("Fetched responses:", data);

            setData(data || []);
        }
    }, []);

    // --- Récupération des réponses du client ---
    const fetchAuditResponses = useCallback(async (id?: number) => {
        if (!id) return;
        const { data, error } = await supabase.rpc("get_audit_responses", { _idaudit: id });
        if (error) {
            console.error("Erreur chargement réponses :", error);
            setError(error.message);
        } else {
            console.log("Fetched responses:", data);
            setInitialResponses(data || []);
            setUpdatedResponses(data || []); // copie de départ
        }
    }, []);

    useEffect(() => {
        if (routeId) {
            fetchAuditData(routeId);
            fetchAuditResponses(routeId);
        }
    }, [routeId, fetchAuditData, fetchAuditResponses]);



    const handleUpdate = (newData: Section[]) => {
        setData(newData);
        console.log("Data updated:", newData);
    };

    return (
        <div className="audit-editor-page">
            <h1>{auditData?.title || "Titre de l'audit"}</h1>

       
            {loading && <p>Chargement des données...</p>}
            {error && <p className="error">Erreur : {error}</p>}

            <AuditForm
                auditId={routeId}
                data={data}
                mode={mode}
                onUpdate={handleUpdate}
                initialResponses={initialResponses}
                updatedResponses={updatedResponses}
                setUpdatedResponses={setUpdatedResponses}
            />
        </div>
    );
}

export default AuditEditorPage;
