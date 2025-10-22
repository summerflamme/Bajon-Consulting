import SectionBox from "./sectionBox";
import type { Audit, Response, Section } from "../../../types/audit";
import './AuditStyle.css';
import { useState, useEffect } from "react";
import SideBarNav from "./sideBarNav";

import type { Dispatch, SetStateAction } from "react";

type Props = {
    data: Section[];
    mode: Audit["mode"];
    responses: Response[];
    setResponses: Dispatch<SetStateAction<Response[]>>;

    onUpdate: (newData: Section[]) => void;
};

function AuditForm({ data, mode, onUpdate, responses, setResponses }: Props) {
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
    };
    const [currentIndex, setCurrentIndex] = useState(0);

    // Quand "data" change, recaler currentIndex pour rester dans les bornes
    useEffect(() => {
        if (data.length === 0) {
            setCurrentIndex(0);
            return;
        }
        if (currentIndex > data.length - 1) {
            setCurrentIndex(data.length - 1);
        }
    }, [data, currentIndex]);

    const handleNext = () => {
        if (currentIndex < data.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const goToSection = (index: number) => {
        setCurrentIndex(index);
    };

    const currentSection = data[currentIndex] ?? null;

    // Rendu sécurisé si pas de sections
    if (!currentSection) {
        return (
            <div className={`audit-container-view`}>
                
                <div className="audit-form-section-edit">
                    <div style={{ padding: 24 }}>
                        <p>Aucune section disponible.</p>
                        {mode === "edit" && (
                            <button
                                type="button"
                                onClick={handleAddSection}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
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
            {/* Sidebar */}
            {
                mode === "edit" &&(

                    <SideBarNav
                        data={data}
                        currentIndex={currentIndex}
                        goToSection={goToSection}
                        />
                )
            }
            {/* Section principale */}
            <div className={`audit-form-section-${mode}`}>
                <form className="">
                    <SectionBox
                        key={currentSection.id}
                        id={currentSection.id}
                        title={currentSection.title}
                        questions={currentSection.questions}
                        mode={mode}
                        onUpdate={(updatedSection) =>
                            updateSection(currentSection.id, updatedSection)
                        }
                        handleRemoveSection={() =>
                            handleRemoveSection(currentSection.id)
                        }
                        responses={responses}
                        setResponses={setResponses}
                        onEnd={handleNext}
                        onPrevious={handlePrevious}

                    />

                    {/* Navigation entre sections */}
                    {mode === "edit" && (
                        <>
                            <div className="flex justify-between mt-6">
                                <button
                                    onClick={handlePrevious}
                                    disabled={currentIndex === 0}
                                    className={`px-4 py-2 rounded ${currentIndex === 0
                                            ? "bg-gray-300 cursor-not-allowed"
                                            : "bg-gray-600 text-white hover:bg-gray-700"
                                        }`}
                                >
                                    Précédent
                                </button>

                                <button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={currentIndex === data.length - 1}
                                    className={`px-4 py-2 rounded ${currentIndex === data.length - 1
                                            ? "bg-gray-300 cursor-not-allowed"
                                            : "bg-blue-600 text-white hover:bg-blue-700"
                                        }`}
                                >
                                    Suivant
                                </button>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleAddSection}
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                >
                                    Ajouter une section
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Valider
                                </button>
                            </div>
                        </>
                    )}
                    </form>
            </div>
        </div>
    );
}

export default AuditForm;
