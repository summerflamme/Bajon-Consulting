import type { Answer, Question,Audit } from "../types/audit";

type Props = Answer & {
    mode: Audit["mode"];
    type: Question["type"];
    onUpdate: (updated: Answer) => void;
    handleRemoveAnswer: () => void;
};

function AnswerBox({ id, text, score, mode, type, onUpdate, handleRemoveAnswer }: Props) {

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({
            id,
            text: e.target.value,
            score,
        });
    };

    const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({
            id,
            text,
            score: Number(e.target.value),
        });
    };

    return (
        <div className="audit-form-answer">
            <div>{type}</div>
            {mode === "edit" ? (
                <>
                    {/* texte de la réponse */}
                    <input
                        type="text"
                        defaultValue={text}
                        onChange={handleTextChange}
                    />
                    {/* champ pour modifier le score */}
                    <input
                        type="number"
                        defaultValue={score}
                        onChange={handleScoreChange}
                    />
                </>
            ) : (
                <div>
                    {text} <small>(score: {score})</small>
                </div>
            )}
            {mode === "edit" && ( <button type="button" onClick={handleRemoveAnswer}>Supprimer la réponse</button>)}
        </div>
    );
}

export default AnswerBox;
