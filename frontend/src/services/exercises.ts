import { IQuestionReponse, IQuestionsResponse } from "../types/IQuestionResponse"

const apiURL = 'http://localhost:8080/api/'

/**
 * @description Service for getting all exercises
 * @returns data - Question response object
 */
export const getExercises = async () => {
    try {
        const response = await fetch(`${apiURL}questions`)
        const data = await response.json()
        return data as IQuestionsResponse
    } catch (e) {
        throw new Error('Error getting questions')
    }
}

/**
 * @description Service for getting an exercise by id
 * @param id - id of the exercise
 * @returns data - Question response object
 */
export const getExerciseById = async (id: string) => {
    try {
        const response = await fetch(`${apiURL}questions/${id}`)
        const data = await response.json()
        return data as IQuestionReponse
    } catch (e) {
        throw new Error('Error getting questions')
    }
}  