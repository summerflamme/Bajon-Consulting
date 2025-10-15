import SectionBox from "./sectionBox";
import type { Audit, Section } from "../../../types/audit";
import './AuditStyle.css';

type Props = {
    data: Section[];
    mode: Audit["mode"];

    onUpdate: (newData: Section[]) => void;
};

function AuditForm({ data, mode, onUpdate }: Props) {
    // Fonction mettre à jour section
    const updateSection = (sectionId: number, updatedSection: Section) => {
        const newData = data.map((s) =>
            s.id === sectionId ? updatedSection : s
        );
        onUpdate(newData);
    };
    const handleAddSection = () => {
        const newSection: Section = {
            id: Date.now(),
            title: "New Section",
            questions: [
                { id: 1, text: "", choices: "single-choice", descriptions: "", answers: [
                    { id: 1, text: "", score: 0 }
                ] },
            ],
        };
        onUpdate([...data, newSection]);
    };
    const handleRemoveSection = (sectionId: number) => {
        const newData = data.filter((s) => s.id !== sectionId);
        onUpdate(newData);
    }

    return (
        <form className="audit-form">

            {data.map((section) => (
                <SectionBox
                    key={section.id}
                    id={section.id}               
                    title={section.title}
                    questions={section.questions}
                    mode={mode}
                    onUpdate={(updatedSection) =>
                        updateSection(section.id, updatedSection)
                    }
                    handleRemoveSection={() => handleRemoveSection(section.id)}
                />
            ))}
            {mode === "edit" && (
                <>
                    <button type="button" onClick={handleAddSection}>Ajouter une section</button>
                    <button type="submit">Valider</button>
                </>
            )}
        </form>

    );
}

export default AuditForm;
