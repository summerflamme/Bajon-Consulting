import QuestionBox from "./questionBox";
import type { Audit, Question, Section } from "../types/audit";

type Props = {
    id: number;
    title: string;
    questions: Question[];
    mode: Audit["mode"];
    handleRemoveSection: () => void;

    onUpdate: (updatedSection: Section) => void;
};

function SectionBox({ id, title, questions, mode, onUpdate, handleRemoveSection }: Props) {
    // Mise à jour du titre de la section
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({
            id,
            title: e.target.value,
            questions,
        });
    };
    const handleRemoveQuestion = (questionId: number) => {
        onUpdate({
            id,
            title,
            questions: questions.filter((q) => q.id !== questionId)
        });
    };

    // Mise à jour d’une question
    const updateQuestion = (questionId: number, updatedQuestion: Question) => {
        const updatedSection: Section = {
            id,
            title,
            questions: questions.map((q) =>
                q.id === questionId ? updatedQuestion : q
            ),
        };
        onUpdate(updatedSection);
    };
    const handleAddQuestion = () => {
        const newQuestion: Question = {
            id: Date.now(),
            text: "New Question",
            choices: "single-choice",
            answers: [
                { id: 1, text: "New Answer", score: 0 }
            ]
        };
        onUpdate({
            id,
            title,
            questions: [...questions, newQuestion]
        });
    };

    return (
        <div className="audit-form-section">
            {mode === "edit" ? (
                <input type="text" defaultValue={title} onChange={handleTitleChange} />
            ) : (
                <h2>{title}</h2>
            )}

            {questions.map((question) => (
                <QuestionBox
                    key={question.id}
                    {...question}
                    mode={mode}
                    onUpdate={(updated) => updateQuestion(question.id, updated)}
                    handleRemoveQuestion={() => handleRemoveQuestion(question.id)}
                />
            ))}
            {mode === "edit" && (
                <>
                <button type="button" onClick={handleAddQuestion}>Ajouter une question</button>
                <button type="button" onClick={handleRemoveSection}>Supprimer la section</button>
                </>
            )}
        </div>
    );
}

export default SectionBox;
