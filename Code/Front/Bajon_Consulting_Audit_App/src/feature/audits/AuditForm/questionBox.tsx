import { motion } from 'framer-motion';
import type { Question, Answer, Audit ,Response} from "../../../types/audit";
import AnswerBox from "./answerBox";
import './AuditStyle.css';
import { DeleteIcon } from "../../../components/ui/delete";
import { ChevronDownIcon } from "../../../components/ui/chevron-down";
import { ChevronUpIcon } from "../../../components/ui/chevron-up";

import { useState } from 'react';

type Props = Question & {
    mode: Audit["mode"];
    handleRemoveQuestion: () => void;
    responses: Response[];
    setResponse: React.Dispatch<React.SetStateAction<Response[]>>;

    onUpdate: (updatedQuestion: Question) => void;
};

function QuestionBox({ id, text, choices, answers, descriptions, mode, onUpdate, handleRemoveQuestion, responses, setResponse }: Props) {

    const [open, setOpen] = useState<boolean>(true);

    const handleChevronClick = () => {
        // Toggle open/close
        setOpen((v) => !v);
    };

    // Mise à jour du texte de la question
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({
            id,
            text: e.target.value,
            choices,
            answers,
            descriptions,
        });
    };
    //suppression de question

    const handleAddAnswer = () => {
        const newAnswer: Answer = {
            id: Date.now(),
            text: "",
            score: 0
        };
        onUpdate({
            id,
            text,
            choices,
            answers: [...answers, newAnswer]
        });
    };
    //suppression de réponse
    const handleRemoveAnswer = (answerId: number) => {
        onUpdate({
            id,
            text,
            choices,
            answers: answers.filter((a) => a.id !== answerId)
        });
    };

    // Mise à jour d’une réponse
    const updateAnswer = (answerId: number, updated: Answer) => {
        const updatedQuestion: Question = {
            id,
            text,
            choices,
            descriptions,
            answers: answers.map((a) =>
                a.id === answerId ? updated : a
            ),
        };
        onUpdate(updatedQuestion);
    };

    return (
        <div className={`audit-form-question-${mode}`}>
            {mode === "edit" ? (
                <>
                    <div className={`audit-form-question-text-${mode}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                        <label>Question </label>
                    {open ? (
                        <ChevronUpIcon onClick={handleChevronClick} style={{ cursor: 'pointer', transition: 'transform 0.18s ease' }} />
                    ) : (
                        <ChevronDownIcon onClick={handleChevronClick} style={{ cursor: 'pointer', transition: 'transform 0.18s ease' }} />
                    )}
                    </div>
                <div className={`audit-form-question-text${mode}`}>
                        <input type="text"
                            value={text === "" ? "" : text}
                            placeholder="Entrer la question" onChange={handleTextChange} />
                    </div>
                    {open && (
                        <div className={`audit-form-descriptions-${mode}`}>
                            <label>Description</label>
                            <textarea
                                placeholder="Entrer la description"
                                value={descriptions || ""}
                                onChange={(e) =>
                                    onUpdate({
                                        id,
                                        text,
                                        choices,
                                        answers,
                                        descriptions: e.target.value,
                                    })
                                }
                                rows={4} // nombre de lignes visibles par défaut
                                className="w-full p-2 border rounded-md resize-y"
                            />

                        </div>
                    )}

                    {open && (
                        <motion.div
                            layout
                            className="audit-form-switch"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25 }}
                        >
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={choices === "multiple-choice"}
                                    onChange={(e) =>
                                        onUpdate({
                                            id,
                                            text,
                                            choices: e.target.checked ? "multiple-choice" : "single-choice",
                                            answers,
                                            descriptions,
                                        })
                                    }
                                />
                                <motion.span
                                    layout
                                    className="slider"
                                    animate={{
                                        backgroundColor:
                                            choices === "multiple-choice"
                                                ? "rgba(72, 100, 255, 0.8)"
                                                : "rgba(150,150,150,0.6)",
                                    }}
                                    transition={{ duration: 0.25 }}
                                />
                            </label>
                            <span className="switch-label">Choix multiple</span>
                        </motion.div>
                    )}

                </>

            ) : (
                <>
                    <label>{text}</label>
                    <div className="audit-form-descriptions-view ">
                        {descriptions || ""}
                       
                    </div>
                </>
            )}
            <div className={mode === "view" ? "audit-form-answer-view" : ""}>

            {open && answers.map((answer) => (
                <AnswerBox
                questionId={id}
                key={answer.id}
                {...answer}
                mode={mode}
                choices={choices}
                responses={responses}
                    setResponse={setResponse}
                onUpdate={(updated) => updateAnswer(answer.id, updated)}
                handleRemoveAnswer={() => handleRemoveAnswer(answer.id)}
                />
            ))}
            </div>
            {open && mode === "edit" && (
                <div className="mt-4 flex gap-2">
                    <motion.button
                        type="button"
                        onClick={handleAddAnswer}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="btn-add bg-blue-500 text-white px-3 py-1.5 rounded-md shadow-sm hover:bg-blue-600"
                    >
                        Ajouter une réponse
                    </motion.button>
                    <DeleteIcon
                        className="delete-icon"
                        onClick={handleRemoveQuestion}
                    />
                </div>

            )}
        </div>
    );
}

export default QuestionBox;
