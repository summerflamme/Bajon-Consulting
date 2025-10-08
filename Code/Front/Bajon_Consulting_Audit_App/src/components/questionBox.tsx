import type { Question, Answer, Audit } from "../types/audit";
import AnswerBox from "./answerBox";

type Props = Question & {
    mode: Audit["mode"];
    handleRemoveQuestion: () => void;

    onUpdate: (updatedQuestion: Question) => void;
};

function QuestionBox({ id, text, choices, answers, descriptions, mode, onUpdate, handleRemoveQuestion }: Props) {
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
            text: "New Answer",
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
        <div className="audit-form-question">
            {mode === "edit" ? (
                <>
                <div className="audit-form-question">
                    <input type="text" defaultValue={text} onChange={handleTextChange} />
                </div>
                    <div className="audit-form-descriptions">

                        <textarea
                            defaultValue={descriptions}
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
                    <div className="audit-form-choices">
                        <input
                            type="checkbox"
                            defaultChecked={choices === "multiple-choice"}
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
                        <span>Choix multiple</span>
                    </div>

            </>
            ) : (
                <>
                    <div >{text}</div>
                        <div className="whitespace-pre-line bg-gray-50 border rounded-md p-3 text-gray-800">
                            {descriptions || ""}
                        </div>
                </>
            )}

            {answers.map((answer) => (
                <AnswerBox
                    questionId={`question-${id}`}
                    key={answer.id}
                    {...answer}
                    mode={mode}
                    choices={choices}
                    onUpdate={(updated) => updateAnswer(answer.id, updated)}
                    handleRemoveAnswer={() => handleRemoveAnswer(answer.id)}
                />
            ))}
            {mode === "edit" && (
                <>
                <button type="button" onClick={handleRemoveQuestion} className="btn-remove">suppression question</button>
                <button type="button" onClick={handleAddAnswer} className="btn-add">Ajouter une réponse</button>
                </>
            )}
        </div>
    );
}

export default QuestionBox;
