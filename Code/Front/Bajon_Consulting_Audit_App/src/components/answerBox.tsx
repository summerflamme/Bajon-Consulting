import type { Answer, Question,Audit } from "../types/audit";

type Props = Answer & {
    questionId: string;
    mode: Audit["mode"];
    choices: Question["choices"];
    onUpdate: (updated: Answer) => void;
    handleRemoveAnswer: () => void;
};

function AnswerBox({ id, text, score, mode, choices, questionId, onUpdate, handleRemoveAnswer }: Props) {
    // Mise à jour du texte de la réponse
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({
            id,
            text: e.target.value,
            score,
        });
    };

    // Mise à jour du score (si besoin)
    const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({
            id,
            text,
            score: Number(e.target.value),
        });
    };

    return (
        <div className="audit-form-answer">
            {mode === "edit" ? (
                <>
                <div className="audit-form-answer">
                    <label htmlFor={`answer-text-${id}`}>Réponse :</label>

                    <input
                        type="text"
                        defaultValue={text}
                        onChange={handleTextChange}
                        />
                        </div>
                        <div className="audit-form-score">
                    <label htmlFor={`answer-score-${id}`}>Score :</label>

                    <input
                        type="number"
                        defaultValue={score}
                        onChange={handleScoreChange}
                        />
                        </div>
                    
                </>
            ) : (<>
            {choices === "multiple-choice" ? (
                <div>
                    <label htmlFor={`answer-choice-${id}`}>{text}</label>
                            <input type="checkbox" name={`checkbox-${questionId}`} />
                </div>
            ) : (<div>

                    <label htmlFor={`answer-choice-${id}`}>{text}</label>

                            <input type="radio" name={`radio-${questionId}`} />
            </div>
            )}
                    
            </>
            )}
            {mode === "edit" && ( <button type="button" onClick={handleRemoveAnswer}>Supprimer la réponse</button>)}
        </div>
    );
}

export default AnswerBox;
