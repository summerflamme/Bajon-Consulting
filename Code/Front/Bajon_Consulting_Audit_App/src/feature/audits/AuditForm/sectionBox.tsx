import { motion, AnimatePresence } from "framer-motion";
import QuestionBox from "./questionBox";
import type { Audit, Question, Section, Response } from "../../../types/audit";
import "./AuditStyle.css";
import React, { useState, useCallback } from "react";
import { DeleteIcon } from "../../../components/ui/delete";

type Props = {
    id: number;
    title: string;
    questions: Question[];
    mode: Audit["mode"];
    handleRemoveSection: () => void;
    onUpdate: (updatedSection: Section) => void;
    responses: Response[];
    setResponses: React.Dispatch<React.SetStateAction<Response[]>>;
    onPrevious?: () => void;
    onEnd?: () => void;
};

function SectionBox({
    id,
    title,
    questions,
    mode,
    onUpdate,
    handleRemoveSection,
    onEnd,
    onPrevious,
    responses,
    setResponses,
}: Props) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    // --- Gestion du titre de section ---
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({
            id,
            title: e.target.value,
            questions,
        });
    };

    // --- Enregistrer ou remplacer une réponse ---
    const handleValidation = useCallback(
        (newResponse: Response) => {
            setResponses((prev) => {
                const exists = prev.findIndex(
                    (r) =>
                        r.idQuestion === newResponse.idQuestion &&
                        r.idAnswer === newResponse.idAnswer
                );

                // S’il existe, on met à jour la réponse
                if (exists !== -1) {
                    const copy = [...prev];
                    copy[exists] = newResponse;
                    return copy;
                }

                // Sinon, on ajoute la nouvelle
                return [...prev, newResponse];
            });
        },
        [setResponses]
    );

    // --- Suppression d'une question ---
    const handleRemoveQuestion = (questionId: number) => {
        onUpdate({
            id,
            title,
            questions: questions.filter((q) => q.id !== questionId),
        });
    };

    // --- Mise à jour d'une question ---
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

    // --- Ajout d'une nouvelle question ---
    const handleAddQuestion = () => {
        const newQuestion: Question = {
            id: Date.now(),
            text: "",
            choices: "single-choice",
            descriptions: "",
            answers: [
                {
                    id: Date.now() + 1,
                    text: "",
                    score: 0,
                },
            ],
        };
        onUpdate({
            id,
            title,
            questions: [...questions, newQuestion],
        });
    };

    // --- Animation du conteneur principal ---
    const containerAnimationProps =
        mode === "edit"
            ? {
                layout: true,
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -20 },
                transition: { duration: 0.3 },
            }
            : { layout: true };

    return (
        <motion.div {...containerAnimationProps}>
            {/* --- Titre de la section --- */}
            {mode === "edit" ? (
                <>
                    <motion.div
                        layout
                        className={`audit-form-section-text-${mode} flex flex-col mb-3`}
                    >
                        <label className="font-semibold">Titre de la section</label>
                        <motion.input
                            type="text"
                            placeholder="Entrer le titre de la section"
                            onChange={handleTitleChange}
                            value={title || ""}
                            className="border p-2 rounded-md shadow-sm"
                        />
                    </motion.div>

                    {/* --- Liste des questions --- */}
                    <AnimatePresence>
                        {questions.map((question) => (
                            <motion.div key={question.id} layout>
                                <QuestionBox
                                    {...question}
                                    mode={mode}
                                    responses={responses}
                                    setResponses={setResponses}
                                    onUpdate={(updated) => updateQuestion(question.id, updated)}
                                    handleRemoveQuestion={() => handleRemoveQuestion(question.id)}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </>
            ) : (
                <>
                    {/* --- Mode "vue" (client) --- */}
                    <label className="audit-form-section-title">{title}</label>

                    {questions.length > 0 && (
                        <div key={questions[currentQuestionIndex].id}>
                            <QuestionBox
                                {...questions[currentQuestionIndex]}
                                mode={mode}
                                responses={responses}
                                setResponses={setResponses}
                                onUpdate={(updated) =>
                                    updateQuestion(
                                        questions[currentQuestionIndex].id,
                                        updated
                                    )
                                }
                                handleRemoveQuestion={() => { }}
                            />
                        </div>
                    )}

                    {/* --- Navigation entre questions --- */}
                    {questions.length > 0 && (
                        <div className="mt-4 flex justify-between items-center">
                            <button
                                type="button"
                                onClick={() => {
                                    if (currentQuestionIndex > 0) {
                                        setCurrentQuestionIndex((i) => Math.max(0, i - 1));
                                    } else {
                                        onPrevious?.();
                                    }
                                }}
                                className="auditform-list-btn"
                            >
                                {currentQuestionIndex > 0
                                    ? "Précédent"
                                    : "Précédent section"}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    const currentQuestion =
                                        questions[currentQuestionIndex];

                                    // Récupère la réponse actuelle
                                    const currentResponse = responses.find(
                                        (r) => r.idQuestion === currentQuestion.id
                                    );

                                    // Enregistre la réponse actuelle si existante
                                    if (currentResponse) handleValidation(currentResponse);

                                    // Navigation
                                    if (currentQuestionIndex < questions.length - 1) {
                                        setCurrentQuestionIndex((i) => i + 1);
                                    } else {
                                        onEnd?.();
                                    }
                                }}
                                className="auditform-list-btn"
                            >
                                {currentQuestionIndex < questions.length - 1
                                    ? "Suivant"
                                    : "Suivant section"}
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* --- Actions en mode édition --- */}
            {mode === "edit" && (
                <div className="mt-4 flex gap-2">
                    <motion.button
                        type="button"
                        onClick={handleAddQuestion}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="auditform-list-btn"
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
