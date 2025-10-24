import { motion } from "framer-motion";
import React, { useCallback } from "react";
import type { Answer, Question, Audit, Response } from "../../../types/audit";
import "./AuditStyle.css";
import { DeleteIcon } from "../../../components/ui/delete";

type Props = {
    idAnswer: number; // ✅ cohérent avec la BDD
    text: string;
    score: number;
    questionId: number;
    mode: Audit["mode"];
    choices: Question["choices"];
    onUpdate: (updated: Answer) => void;
    handleRemoveAnswer: () => void;
    responses: Response[];
    setResponses: React.Dispatch<React.SetStateAction<Response[]>>;
};

function AnswerBox({
    idAnswer,
    text,
    score,
    mode,
    choices,
    questionId,
    onUpdate,
    handleRemoveAnswer,
    responses,
    setResponses,
}: Props) {
    // --- Mise à jour du texte ---
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({ id: idAnswer, text: e.target.value, score });
    };

    // --- Mise à jour du score ---
    const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({ id: idAnswer, text, score: Number(e.target.value) });
    };

    // --- Vérifie si cette réponse est cochée (optimisé avec useMemo) ---
    const isChecked = responses.some(
        (r) => r.idQuestion === questionId && r.idAnswer === idAnswer
    );


    // ✅ Gestion des cases à cocher (multi-choice)
    const onChangeCheckbox = useCallback(() => {
        setResponses((prev) => {
            // Vérifie si la paire (idQuestion, idAnswer) existe déjà
            const exists = prev.some(
                (r) =>
                    Number(r.idQuestion) === Number(questionId) &&
                    Number(r.idAnswer) === Number(idAnswer)
            );

            if (exists) {
                // 🔹 Si déjà présente → on la retire
                return prev.filter(
                    (r) =>
                        !(
                            Number(r.idQuestion) === Number(questionId) &&
                            Number(r.idAnswer) === Number(idAnswer)
                        )
                );
            }

            // 🔹 Sinon → on l’ajoute proprement (garde les autres de la même question)
            return [...prev, { idQuestion: questionId, idAnswer }];
        });
    }, [questionId, idAnswer, setResponses]);

    // ✅ Gestion des boutons radio (choix unique)
    const onChangeRadio = useCallback(() => {
        setResponses((prev) => {
            const alreadyExists = prev.some(
                (r) =>
                    Number(r.idQuestion) === Number(questionId) &&
                    Number(r.idAnswer) === Number(idAnswer)
            );

            if (alreadyExists) {
                // 🔸 Si on reclique sur la même réponse → on désélectionne
                return prev.filter((r) => r.idQuestion !== questionId);
            }

            // 🔹 Supprime les anciennes réponses pour cette question et ajoute la nouvelle
            const others = prev.filter((r) => r.idQuestion !== questionId);
            return [...others, { idQuestion: questionId, idAnswer }];
        });
    }, [questionId, idAnswer, setResponses]);

    // --- Animation fluide ---
    const containerAnimationProps =
        mode === "edit"
            ? {
                layout: true,
                initial: { opacity: 0, x: -10 },
                animate: { opacity: 1, x: 0 },
                exit: { opacity: 0, x: 10 },
                transition: { duration: 0.25 },
            }
            : { layout: false };

    return (
        <motion.div
            {...containerAnimationProps}
            className={`audit-form-answer-${mode}`}
        >
            {mode === "edit" ? (
                <>
                    {/* --- MODE ÉDITION --- */}
                    <div className="audit-form-text-edit">
                        <label htmlFor={`answer-text-${idAnswer}`}>Réponse</label>
                        <motion.input
                            id={`answer-text-${idAnswer}`}
                            type="text"
                            value={text}
                            placeholder="Entrer la réponse"
                            onChange={handleTextChange}
                            whileFocus={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                        />
                    </div>

                    <div className="audit-form-score-edit">
                        <label htmlFor={`answer-score-${idAnswer}`}>Score</label>
                        <motion.input
                            id={`answer-score-${idAnswer}`}
                            type="number"
                            value={score === 0 ? "" : score}
                            placeholder="0"
                            onChange={handleScoreChange}
                            whileFocus={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                        />
                    </div>

                    <DeleteIcon className="delete-icon" onClick={handleRemoveAnswer} />
                </>
            ) : (
                <>
                    {/* --- MODE VUE (CLIENT) --- */}
                    <div
                        className={`answer-choice ${isChecked ? "selected" : ""}`}
                    >
                        <label
                            htmlFor={`answer-choice-${idAnswer}`}
                            className="cursor-pointer"
                        >
                            {text}
                        </label>

                        {choices === "multiple-choice" ? (
                            <motion.input
                                type="checkbox"
                                id={`answer-choice-${idAnswer}`}
                                checked={isChecked}
                                onChange={onChangeCheckbox}
                                whileTap={{ scale: 0.9 }}
                                className="hidden"
                            />
                        ) : (
                            <motion.input
                                type="radio"
                                id={`answer-choice-${idAnswer}`}
                                name={`radio-${questionId}`}
                                checked={isChecked}
                                onChange={onChangeRadio}
                                whileTap={{ scale: 0.9 }}
                                className="hidden"
                            />
                        )}
                    </div>
                </>
            )}
        </motion.div>
    );
}

export default AnswerBox;
