import { motion } from "framer-motion";
import type { Answer, Question, Audit } from "../types/audit";
import "./AuditStyle.css";
import { DeleteIcon} from "./ui/delete";
type Props = Answer & {
    questionId: string;
    mode: Audit["mode"];
    choices: Question["choices"];
    onUpdate: (updated: Answer) => void;
    handleRemoveAnswer: () => void;
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

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.25 }}
            className={`audit-form-answer-${mode} `}
        >
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
                <motion.div
                    layout
                    className="flex items-center gap-2"
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                >
                    <label htmlFor={`answer-choice-${id}`} className="cursor-pointer">
                        {text}
                    </label>

                    {choices === "multiple-choice" ? (
                        <motion.input
                            type="checkbox"
                            name={`checkbox-${questionId}`}
                            id={`answer-choice-${id}`}
                            whileTap={{ scale: 0.9 }}
                        />
                    ) : (
                        <motion.input
                            type="radio"
                            name={`radio-${questionId}`}
                            id={`answer-choice-${id}`}
                            whileTap={{ scale: 0.9 }}
                        />
                    )}
                </motion.div>
            )}
        </motion.div>
    );
}

export default AnswerBox;
