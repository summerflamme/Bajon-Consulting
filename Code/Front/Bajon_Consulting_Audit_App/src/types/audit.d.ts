// Définition des types
type Answer = {
    id: number;
    text: string;
    score: number;
};

type Question = {
    id: number;
    text: string;
    descriptions?: string;
    type: "single-choice" | "multiple-choice"; // tu peux étendre selon tes besoins
    answers: Answer[];
};

type Section = {
    id: number;
    title: string;
    questions: Question[];
};

type Audit = {
    mode: "edit" | "view";
};
// Le tableau de données
const data: Section[] = [
    {
        id: 1,
        title: "Section 1",
        questions: [
            {
                id: 1,
                text: "Question 1.1 texte long pour tester le retour à la ligne dans le composant",
                type: "single-choice",
                descriptions: "description de la question 1.1",
                answers: [
                    { id: 1, text: "Réponse 1.1", score: -10 },
                    { id: 2, text: "Réponse 1.2", score: 0 },
                    { id: 3, text: "Réponse 1.3", score: 30 },
                ],
            },
            {
                id: 2,
                text: "Question 1.2",
                type: "single-choice",
                descriptions: "description de la question 1.2",
                answers: [
                    { id: 1, text: "Réponse 1.1", score: -10 },
                    { id: 2, text: "Réponse 1.2", score: 10 },
                    { id: 3, text: "Réponse 1.3", score: 0 },
                ],
            },
            {
                id: 3,
                text: "Question 1.3",
                type: "single-choice",
                answers: [
                    { id: 1, text: "Réponse 1.1", score: 0 },
                    { id: 2, text: "Réponse 1.2", score: 10 },
                    { id: 3, text: "Réponse 1.3", score: 20 },
                ],
            },
        ],
    },{
        id: 2,
        title: "Section 2",
        questions: [
            {
                id: 1,
                text: "Question 2.1",
                type: "single-choice",
                descriptions: "description de la question 2.1",

                answers: [
                    { id: 1, text: "Réponse 2.1", score: -10 },
                    { id: 2, text: "Réponse 2.2", score: 0 },
                    { id: 3, text: "Réponse 2.3", score: 30 },
                ],
            },
            {
                id: 2,
                text: "Question 2.2",
                type: "single-choice",
                descriptions: "description de la question 2.2",
                answers: [
                    { id: 1, text: "Réponse 2.1", score: -10 },
                    { id: 2, text: "Réponse 2.2", score: 10 },
                    { id: 3, text: "Réponse 2.3", score: 0 },
                ],
            },
            {
                id: 3,
                text: "Question 2.3",
                type: "single-choice",
                descriptions: "description de la question 2.3",
                answers: [
                    { id: 1, text: "Réponse 2.1", score: 0 },
                    { id: 2, text: "Réponse 2.2", score: 10 },
                    { id: 3, text: "Réponse 2.3", score: 20 },
                ],
            },
        ],
    }
];
export { Answer, Question, Section, data , Audit };