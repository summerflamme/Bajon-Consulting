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

function AuditEditorPage({ mode = "view" }: Props) {
    const params = useParams();
    const routeId = params.id ? parseInt(params.id, 10) : undefined;
    //recupere le nom de l'audit pour l'afficher en titre sur supabase
    async function getAuditNameById(auditId: number): Promise<string | null> {
        const { data, error } = await supabase
            .from('audit')
            .select('auditname')
            .eq('id', auditId)
            .single();

        if (error) {
            console.error(error);
            return null;
        }

        return data.auditname;
    }
    const [auditName, setAuditName] = useState<string | null>(null);

    useEffect(() => {
        if (routeId) {
            getAuditNameById(routeId).then(name => setAuditName(name));
        }
    }, [routeId]);

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
        

        if (error) {
            console.error("Erreur chargement audit :", error);
            setError(error.message);
        } else {

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
            <h1>{auditName || "Titre de l'audit"}</h1>

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
