import { IQuestion } from "./IQuestion";

export interface IQuestionsResponse {
    message: string,
    questions: IQuestion[]
}

export interface IQuestionReponse {
    message: string,
    question: IQuestion
}