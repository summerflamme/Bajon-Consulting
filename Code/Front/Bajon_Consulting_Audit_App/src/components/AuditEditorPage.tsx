import React, { useState } from 'react';
import AuditForm from './AuditForm';
import type { Section } from '../types/audit';
import './AuditStyle.css';

function AuditEditorPage() {
    const [data, setData] = useState<Section[]>([
            {
                id: 1,
                title: "Section 1",
                questions: [
                    {
                        id: 1,
                        text: "Question 1.1 ",
                        choices: "single-choice",
                        descriptions: "description de la question 1.1",
                        answers: [
                            { id: 1, text: "Réponse 1.1", score: -10 },
                            { id: 2, text: "Réponse 1.2", score: 0 },
                            { id: 3, text: "Réponse 1.3", score: 30 },
                        ],
                    },
                    {
                        id: 2,
                        text: "Question 1.2",
                        choices: "single-choice",
                        descriptions: "description de la question 1.2",
                        answers: [
                            { id: 1, text: "Réponse 1.1", score: -10 },
                            { id: 2, text: "Réponse 1.2", score: 10 },
                            { id: 3, text: "Réponse 1.3", score: 0 },
                        ],
                    },
                    {
                        id: 3,
                        text: "Question 1.3",
                        choices: "single-choice",
                        descriptions: "description de la question 1.3",
                        answers: [
                            { id: 1, text: "Réponse 1.1", score: 0 },
                            { id: 2, text: "Réponse 1.2", score: 10 },
                            { id: 3, text: "Réponse 1.3", score: 20 },
                        ],
                    },
                ],
            }, {
                id: 2,
                title: "Section 2",
                questions: [
                    {
                        id: 1,
                        text: "Question 2.1",
                        choices: "single-choice",
                        descriptions: "description de la question 2.1",
                        answers: [
                            { id: 1, text: "Réponse 2.1", score: -10 },
                            { id: 2, text: "Réponse 2.2", score: 0 },
                            { id: 3, text: "Réponse 2.3", score: 30 },
                        ],
                    },
                    {
                        id: 2,
                        text: "Question 2.2",
                        choices: "single-choice",
                        descriptions: "description de la question 2.2",
                        answers: [
                            { id: 1, text: "Réponse 2.1", score: -10 },
                            { id: 2, text: "Réponse 2.2", score: 10 },
                            { id: 3, text: "Réponse 2.3", score: 0 },
                        ],
                    },
                    {
                        id: 3,
                        text: "Question 2.3",
                        choices: "single-choice",
                        descriptions: "description de la question 2.3",
                        answers: [
                            { id: 1, text: "Réponse 2.1", score: 0 },
                            { id: 2, text: "Réponse 2.2", score: 10 },
                            { id: 3, text: "Réponse 2.3", score: 20 },
                        ],
                    },
                ],
            }
        ]);
    const clearData = () => setData([]);
    const [mode, setMode] = useState<"edit" | "view">("edit");
    const toggleMode = () => setMode(mode === "edit" ? "view" : "edit");



    const handleUpdate = (newData: Section[]) => {
        setData(newData);
        console.log("Data updated:", newData);
    };
    return (
        <div className="audit-editor-page">
            <h1>Audit Editor Page</h1>
            {/* Contenu de la page d'édition d'audit */}
            <p>Bienvenue sur la page d'édition d'audit.</p>
            <p>Vous pouvez modifier les paramètres de l'audit ici.</p>
            <button onClick={clearData}>Vider</button>
            <button onClick={toggleMode}>{mode === "edit" ? "Passer en mode vue" : "Passer en mode édition"}</button>

            <AuditForm  data={data} mode={mode} onUpdate={handleUpdate} />


        </div>
    );
}
export default AuditEditorPage;