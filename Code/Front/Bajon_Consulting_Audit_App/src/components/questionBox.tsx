import type { Question, Answer, Audit } from "../types/audit";
import AnswerBox from "./answerBox";

type Props = Question & {
    mode: Audit["mode"];
    handleRemoveQuestion: () => void;

    onUpdate: (updatedQuestion: Question) => void;
};

function QuestionBox({ id, text, type, answers, descriptions, mode, onUpdate, handleRemoveQuestion }: Props) {
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({
            id,
            text: e.target.value,
            type,
            answers,
            descriptions,
        });
    };
    //suppression de question
    
    const handleAddAnswer = () => {
        const newAnswer: Answer = {
            id: Date.now(),
            text: "New Answer",
            score: 0
        };
        onUpdate({
            id,
            text,
            type,
            answers: [...answers, newAnswer]
        });
    };
    const handleRemoveAnswer = (answerId: number) => {
        onUpdate({
            id,
            text,
            type,
            answers: answers.filter((a) => a.id !== answerId)
        });
    };

    // Mise à jour d’une réponse
    const updateAnswer = (answerId: number, updated: Answer) => {
        const updatedQuestion: Question = {
            id,
            text,
            type,
            descriptions,
            answers: answers.map((a) =>
                a.id === answerId ? updated : a
            ),
        };
        onUpdate(updatedQuestion);
    };

    return (
        <div className="audit-form-question">
            {mode === "edit" ? (
                <>
                    <input type="text" defaultValue={text} onChange={handleTextChange} />
                <input type="text" defaultValue={descriptions} onChange={(e) => onUpdate({
                    id,
                    text,
                    type,
                    answers,
                    descriptions: e.target.value,
                })} />
                    
                </>
            ) : (
                <>
                    <div>{text}</div>
                    <div>{descriptions}</div>
                </>
            )}

            {answers.map((answer) => (
                <AnswerBox
                    key={answer.id}
                    {...answer}
                    mode={mode}
                    type={type}
                    onUpdate={(updated) => updateAnswer(answer.id, updated)}
                    handleRemoveAnswer={() => handleRemoveAnswer(answer.id)}
                />
            ))}
            {mode === "edit" && (
                <>
                <button type="button" onClick={handleRemoveQuestion}>suppression question</button>
                    <button type="button" onClick={handleAddAnswer}>Ajouter une réponse</button>
                </>
            )}
        </div>
    );
}

export default QuestionBox;
