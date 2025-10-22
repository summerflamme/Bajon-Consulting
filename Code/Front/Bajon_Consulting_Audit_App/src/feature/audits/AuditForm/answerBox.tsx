import { motion } from "framer-motion";
import React, { useCallback } from 'react';
import type { Answer, Question, Audit,Response } from "../../../types/audit";
import "./AuditStyle.css";
import { DeleteIcon} from "../../../components/ui/delete";
type Props = Answer & {
    questionId: number;
    mode: Audit["mode"];
    choices: Question["choices"];
    onUpdate: (updated: Answer) => void;
    handleRemoveAnswer: () => void;
    responses: Response[];
    setResponse: React.Dispatch<React.SetStateAction<Response[]>>;
};

function AnswerBox({
    id,
    text,
    score,
    mode,
    choices,
    questionId,
    onUpdate,
    handleRemoveAnswer,
    responses,
    setResponse,
}: Props) {
    // Mise à jour du texte de la réponse
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({
            id,
            text: e.target.value,
            score,
        });
    };
   

    // Mise à jour du score
    const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({
            id,
            text,
            score: Number(e.target.value),
        });
    };
     
    // Only run the entry/exit opacity translation animation in edit mode.
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

    // compute checked state and stable handlers at component scope
    const isChecked = responses.some(
        (r) => r.idAnswer === id && r.idQuestion === questionId
    );

    const onChangeCheckbox = useCallback(() => {
        setResponse((prev) =>
            isChecked
                ? prev.filter((r) => !(r.idQuestion === questionId && r.idAnswer === id))
                : [...prev, { idAnswer: id, idQuestion: questionId }]
        );
    }, [isChecked, questionId, id, setResponse]);

    const onChangeRadio = useCallback(() => {
        setResponse((prev) => [
            ...prev.filter((r) => r.idQuestion !== questionId),
            { idAnswer: id, idQuestion: questionId },
        ]);
    }, [questionId, id, setResponse]);

    return (
        <motion.div {...containerAnimationProps} className={`audit-form-answer-${mode} `}>
            {mode === "edit" ? (
                <>
                    <div className="audit-form-text-edit">
                        <label htmlFor={`answer-text-${id}`}>Réponse</label>
                        <motion.input
                            id={`answer-text-${id}`}
                            type="text"
                            value={text === "" ? "" : text}
                            placeholder="Entrer la réponse"
                            onChange={handleTextChange}
                            whileFocus={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                        />
                    </div>

                    <div className="audit-form-score-edit">
                        <label htmlFor={`answer-score-${id}`}>Score</label>
                        <motion.input
                            id={`answer-score-${id}`}
                            type="number"
                            value={score === 0 ? "" : score}
                            placeholder="0"
                            onChange={handleScoreChange}
                            whileFocus={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                        />
                    </div>

                    <DeleteIcon
                        className="delete-icon"
                        onClick={handleRemoveAnswer}
                    />
                </>
            ) : (
                <div className={`answer-choice ${isChecked ? 'selected' : ''}`}>
                    <label htmlFor={`answer-choice-${id}`} className="cursor-pointer">
                        {text}
                    </label>
                    {choices === 'multiple-choice' ? (
                        <motion.input
                            type="checkbox"
                            name={`checkbox-${questionId}`}
                            id={`answer-choice-${id}`}
                            whileTap={{ scale: 0.9 }}
                            checked={isChecked}
                            onChange={onChangeCheckbox}
                                className="hidden"
                        />
                    ) : (
                        <motion.input
                            type="radio"
                            name={`radio-${questionId}`}
                            id={`answer-choice-${id}`}
                            whileTap={{ scale: 0.9 }}
                            checked={isChecked}
                            onChange={onChangeRadio}
                            className="hidden"
                        />
                    )}
                </div>
            )}
        </motion.div>
    );
}

export default AnswerBox;
