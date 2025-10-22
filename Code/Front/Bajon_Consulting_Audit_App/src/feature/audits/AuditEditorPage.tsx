import { useState, useCallback } from 'react';
import AuditForm from './AuditForm/AuditForm';
import type { Response, Section } from '../../types/audit';
import './AuditForm/AuditStyle.css';

function AuditEditorPage() {
    const [responses, setResponses] = useState<Response[]>([

        {
            idAnswer: 1,
            idQuestion: 1
        },
        {
            idAnswer: 2,
            idQuestion: 2
        }

    ]);

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
                    text: "Question 3.3",
                    choices: "single-choice",
                    descriptions: "description de la question 3.3",
                    answers: [
                        { id: 1, text: "Réponse 3.1", score: 0 },
                        { id: 2, text: "Réponse 3.2", score: 10 },
                        { id: 3, text: "Réponse 3.3", score: 20 },
                    ],
                },
            ],
        }
    ]);
    const clearData = useCallback(() => setData([]), []);
    const [mode, setMode] = useState<"edit" | "view">("view");
    const toggleMode = useCallback(() => setMode((m) => (m === 'edit' ? 'view' : 'edit')), []);



    const handleUpdate = (newData: Section[]) => {
        setData(newData);
        console.log("Data updated:", newData);
    };
    return (
        <div className="audit-editor-page">
            <h1>Audit Editor Page</h1>
            <button onClick={clearData}>Vider</button>
            <button onClick={toggleMode}>{mode === "edit" ? "Passer en mode vue" : "Passer en mode édition"}</button>
            <AuditForm data={data} mode={mode} onUpdate={handleUpdate} responses={responses} setResponses={setResponses} />


        </div>
    );
}
export default AuditEditorPage;