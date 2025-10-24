// Définition des types
type Answer = {
    id: number;
    text: string;
    score: number;
};

type Response = {
    
    idAnswer: number;

    idQuestion: number;

}

type Question = {
    id: number;
    text: string;
    descriptions?: string;
    choices: "single-choice" | "multiple-choice"; // tu peux étendre selon tes besoins
    answers: Answer[];
};

type Section = {
    id: number;
    title: string;
    questions: Question[];
};

type Audit = {
    mode: "edit" | "view";
    title: string;
    idclient: number;

    sections: Section[];
};
export { Answer, Question, Section, data, Audit, Response };