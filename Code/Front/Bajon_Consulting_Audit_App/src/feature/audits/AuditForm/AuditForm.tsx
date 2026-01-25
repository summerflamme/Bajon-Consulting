import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/ToastProvider";
import SectionBox from "./sectionBox";
import SideBarNav from "./sideBarNav";
import { supabase } from "@/supabaseClient";
import type { Audit, Response, Section } from "../../../types/audit";
import "./AuditStyle.css";

type Props = {
    data: Section[];
    mode: Audit["mode"];
    initialResponses: Response[];
    updatedResponses: Response[];
    setUpdatedResponses: React.Dispatch<React.SetStateAction<Response[]>>;
    onUpdate: (newData: Section[]) => void;
    auditId?: number;
};

function AuditForm({
    data,
    mode,
    initialResponses,
    updatedResponses,
    setUpdatedResponses,
    onUpdate,
    auditId,
}: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const toast = useToast();

    // Compare les réponses initiales et modifiées
    const getChangedResponses = (initial: Response[], updated: Response[]) => {
        const serialize = (arr: Response[]) => arr.map(r => `${r.idQuestion}-${r.idAnswer}`);
        const initialSet = new Set(serialize(initial));
        return updated.filter(r => !initialSet.has(`${r.idQuestion}-${r.idAnswer}`));
    };
    //  Ajouter une nouvelle section
    const handleAddSection = () => {
        const newSection: Section = {
            id: Date.now(),
            title: "Nouvelle section",
            questions: [
                {
                    id: Date.now() + 1,
                    text: "",
                    choices: "single-choice",
                    descriptions: "",
                    answers: [{ id: Date.now() + 2, text: "", score: 0 }]
                },
            ],
        };
        onUpdate([...data, newSection]);
        // positionner directement la nouvelle section
        setCurrentIndex(data.length);
        // demander au rendu de la nouvelle section de se focaliser
        setFocusSectionId(newSection.id);
    };

    const [focusSectionId, setFocusSectionId] = useState<number | null>(null);

    // Supprime une section en protégeant l'index courant
    const removeSection = (id: number) => {
        const newData = data.filter((s) => s.id !== id);
        onUpdate(newData);

        // Ajuste l'index courant pour rester dans les bornes
        if (newData.length === 0) {
            setCurrentIndex(0);
        } else {
            setCurrentIndex((i) => Math.max(0, Math.min(i, newData.length - 1)));
        }

        // supprime tout focus pending
        setFocusSectionId(null);
    };

    // --- Mise à jour (structure ou réponses) ---
    const updateAudit = useCallback(async () => {
        if (!auditId) {
            toast?.error("Aucun audit sélectionné");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const isEditMode = mode === "edit";
            let rpcPayload;
            let rpcName;

            if (isEditMode) {
                rpcName = "update_audit_data";
                rpcPayload = { _idaudit: auditId, _data: data };
            } else {
                rpcName = "update_audit_responses";
                const changed = getChangedResponses(initialResponses, updatedResponses);
                rpcPayload = {
                    _idaudit: auditId,
                    _responses: changed.length > 0 ? changed : updatedResponses,
                };
            }

            console.log("➡️ Appel RPC :", rpcName, rpcPayload);
            const { data: result, error } = await supabase.rpc(rpcName, rpcPayload);

            if (error) {
                console.error("❌ Erreur RPC :", error);
                setError(error.message);
                toast?.error(error.message);
                return;
            }

            console.log(" Succès :", result);
            toast?.success(
                isEditMode
                    ? "Structure d’audit mise à jour avec succès"
                    : "Réponses enregistrées avec succès"
            );

            if (!isEditMode) {
                // Mise à jour de la baseline
                toast?.info("Les réponses initiales ont été actualisées");
            }

            navigate("/audits");
        } catch (err) {
            console.error("Erreur inattendue :", err);
            const msg =
                err instanceof Error
                    ? err.message
                    : "Erreur inattendue lors de la mise à jour.";
            setError(msg);
            toast?.error(msg);
        } finally {
            setLoading(false);
        }
    }, [auditId, mode, data, initialResponses, updatedResponses, toast, navigate]);

    // --- Navigation entre sections ---
    const handleNext = () => currentIndex < data.length - 1 && setCurrentIndex(currentIndex + 1);
    const handlePrevious = () => currentIndex > 0 && setCurrentIndex(currentIndex - 1);
    const goToSection = (index: number) => setCurrentIndex(index);

    const currentSection = data[currentIndex] ?? null;

    if (!currentSection) {
        return (
            <div className="audit-container-view">
                <div className="audit-form-section-edit">
                    <div style={{ padding: 24 }}>
                        <p>Aucune section disponible.</p>
                        {mode === "edit" && (
                            <button type="button" onClick={handleAddSection} className="auditform-list-btn">
                                Ajouter une section
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`audit-container-${mode}`}>
            {mode === "edit" && (
                <SideBarNav data={data} currentIndex={currentIndex} goToSection={goToSection} />
            )}

            <div className={`audit-form-section-${mode}`}>
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        await updateAudit();
                    }}
                >
                    <SectionBox
                        key={currentSection.id}
                        id={currentSection.id}
                        title={currentSection.title}
                        questions={currentSection.questions}
                        focusOnMount={focusSectionId === currentSection.id}
                        onFocusDone={() => setFocusSectionId(null)}
                        mode={mode}
                        onUpdate={(updatedSection) =>
                            onUpdate(
                                data.map((s) =>
                                    s.id === currentSection.id ? updatedSection : s
                                )
                            )
                        }
                        handleRemoveSection={() => removeSection(currentSection.id)}
                        responses={updatedResponses}
                        setResponses={setUpdatedResponses}
                        onEnd={handleNext}
                        onPrevious={handlePrevious}
                    />

                    <div className="mt-6 flex gap-3 alignItems">
                        {mode === "edit" && (
                            <button type="button" onClick={handleAddSection} className="auditform-list-btn">
                                Ajouter une section
                            </button>
                        )}
                        <button type="submit" className="auditform-list-btn" disabled={loading}>
                            {loading ? "Enregistrement..." : "Enregistrer"}
                        </button>
                            <button type="button" className="auditform-list-btn" onClick={() => navigate("/audits")}>
                            Annuler
                        </button>
                    </div>

                    {error && <p className="error-text">Erreur : {error}</p>}
                </form>
            </div>
        </div>
    );
}

export default AuditForm;
