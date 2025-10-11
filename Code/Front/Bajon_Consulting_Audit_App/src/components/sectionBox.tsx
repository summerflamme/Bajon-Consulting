import { motion, AnimatePresence } from "framer-motion";
import QuestionBox from "./questionBox";
import type { Audit, Question, Section } from "../types/audit";
import "./AuditStyle.css";
import { DeleteIcon } from "./ui/delete";

type Props = {
    id: number;
    title: string;
    questions: Question[];
    mode: Audit["mode"];
    handleRemoveSection: () => void;
    onUpdate: (updatedSection: Section) => void;
};

function SectionBox({
    id,
    title,
    questions,
    mode,
    onUpdate,
    handleRemoveSection,
}: Props) {
    // --- Gestion des événements ---
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
            questions: questions.filter((q) => q.id !== questionId),
        });
    };

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
            text: "",
            choices: "single-choice",
            answers: [{ id: Date.now(), text: "", score: 0 }],
        };
        onUpdate({
            id,
            title,
            questions: [...questions, newQuestion],
        });
    };

    // --- Animation principale du container ---
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`audit-form-section-${mode} border rounded-xl shadow-md p-4 mb-5 bg-white`}
        >
            {/* En-tête de la section */}
            {mode === "edit" ? (
                <motion.div
                    layout
                    className={`audit-form-section-text-${mode} flex flex-col mb-3`}
                >
                    <label className="font-semibold">Titre de la section </label>
                    <motion.input
                        type="text"
                        placeholder="Entrer le titre de la section"
                        onChange={handleTitleChange}
                        whileFocus={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                        className="border p-2 rounded-md shadow-sm"
                    />
                </motion.div>
            ) : (
                <motion.h2
                    layout
                    className="text-lg font-bold mb-4 border-b pb-2 text-gray-800"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {title}
                </motion.h2>
            )}

            {/* Liste des questions avec animations */}
            <AnimatePresence>
                {questions.map((question) => (
                    <motion.div
                        key={question.id}
                        layout
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25 }}
                    >
                        <QuestionBox
                            {...question}
                            mode={mode}
                            onUpdate={(updated) => updateQuestion(question.id, updated)}
                            handleRemoveQuestion={() => handleRemoveQuestion(question.id)}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Boutons d’action */}
            {mode === "edit" && (
                <div className="mt-4 flex gap-2">
                    <motion.button
                        type="button"
                        onClick={handleAddQuestion}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="btn-add bg-blue-500 text-white px-3 py-1.5 rounded-md shadow-sm hover:bg-blue-600"
                    >
                        Ajouter une question
                    </motion.button>

                    <DeleteIcon
                        className="delete-icon"
                        onClick={handleRemoveSection}
                    />
                </div>
            )}
        </motion.div>
    );
}
export default SectionBox;