import { motion, AnimatePresence } from "framer-motion";
import QuestionBox from "./questionBox";
import type { Audit, Question, Section,Response } from "../../../types/audit";
import "./AuditStyle.css";
import React, { useState, useCallback } from 'react';
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
    
    onEnd?: () => void; // called when user reaches end of questions in view mode
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
    // --- Gestion des événements ---
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({
            id,
            title: e.target.value,
            questions,
        });
    };
    // Use the parent responses/setResponses passed down so selections persist across navigation
    const handleValidedation = useCallback((newResponse: Response) => {
        setResponses((prevResponses) => {
            const existingIndex = prevResponses.findIndex(
                (r) => r.idQuestion === newResponse.idQuestion
            );
            if (existingIndex !== -1) {
                // replace the response for this question
                const updatedResponses = [...prevResponses];
                updatedResponses[existingIndex] = newResponse;
                return updatedResponses;
            }
            return [...prevResponses, newResponse];
        });
    }, [setResponses]);

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
    // Only apply the opacity/translate enter/exit animations in edit mode.
    // In view mode we keep layout animation but avoid the fade (fondue).
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
            {/* En-tête de la section */}
            {mode === "edit" ? (
                <>
                    <motion.div
                        layout
                        className={`audit-form-section-text-${mode} flex flex-col mb-3`}
                    >
                        <label className="font-semibold">Titre de la section </label>
                        <motion.input
                            type="text"
                            placeholder="Entrer le titre de la section"
                            onChange={handleTitleChange}
                            className="border p-2 rounded-md shadow-sm"
                        />
                    </motion.div>
                    <AnimatePresence>
                        {questions.map((question) => (
                            <motion.div
                                key={question.id}
                                layout
                            >
                                <QuestionBox
                                    {...question}
                                    mode={mode}
                                    responses={responses}
                                    setResponse={setResponses}
                                    onUpdate={(updated) => updateQuestion(question.id, updated)}
                                    handleRemoveQuestion={() => handleRemoveQuestion(question.id)}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </>
            ) : (
                // View mode
                <>
                <label className="audit-form-section-title">{title}</label>
                
                {questions.length > 0 && (
                    <div key={questions[currentQuestionIndex].id}>
                        <QuestionBox
                            responses={responses}
                            setResponse={setResponses}
                            {...questions[currentQuestionIndex]}
                            mode={mode}
                            onUpdate={(updated) => updateQuestion(questions[currentQuestionIndex].id, updated)}
                            handleRemoveQuestion={() => {}}
                        />
                    </div>
                )}

                {questions.length > 0 && (
                    <div className="mt-4 flex justify-between items-center">
                        <button
                            type="button"
                            onClick={() => {
                                if (currentQuestionIndex > 0) {
                                    setCurrentQuestionIndex((i) => Math.max(0, i - 1));
                                } else {
                                    // If already at first question, go to previous section
                                    onPrevious?.();
                                }
                            }}
                            className="btn-nav"
                        >
                            {currentQuestionIndex > 0 ? 'Précédent' : 'Précédent section'}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                // Save current selection before moving on
                                const currentQuestion = questions[currentQuestionIndex];
                                handleValidedation({ idAnswer: responses.find(r => r.idQuestion === currentQuestion.id)?.idAnswer ?? 0, idQuestion: currentQuestion.id });

                                if (currentQuestionIndex < questions.length - 1) {
                                    setCurrentQuestionIndex((i) => i + 1);
                                } else {
                                    // reached end of this section
                                    onEnd?.();
                                }
                            }}
                            className="btn-primary"
                        >
                            {currentQuestionIndex < questions.length - 1 ? 'Suivant' : 'Suivant section'}
                        </button>
                    </div>
                )}
                </>
            )}

            {/* Liste des questions avec animations */}


            {/* Boutons d’action */}
            {mode === "edit" && (
                <div className="mt-4 flex gap-2">
                    <motion.button
                        type="button"
                        onClick={handleAddQuestion}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="btn-add shadow-sm"
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