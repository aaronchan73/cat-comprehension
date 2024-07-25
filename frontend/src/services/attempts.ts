import { v4 as uuidv4 } from 'uuid'
import { IAddAttemptResponse } from '../types/AddAttempt'
import { IGetAttemptByUsername } from '../types/IGetAttemptByUsername'
import { IResult } from '../types/IResult'
import { IFeedbackResponse } from '../types/IFeedbackProps'

/**
 * @description - Service for adding an attempt to the db
 * @param username - username of the user
 * @param description - summaryDescription of the code question
 * @param questionId - id of the code question
 * @returns data - response from the db as IAddAttemptResponse
 */
export const addAttempt = async (username: string, description: string, questionId: string) => {
    try {
        const attemptId = uuidv4()
        const response = await fetch(`http://localhost:8080/api/attempts/${attemptId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, description, questionId })
        })
        const data = await response.json()

        return data as IAddAttemptResponse
    } catch (e) {
        throw new Error('Error adding attempt')
    }
}

/**
 * @description - Service for getting an attempt by username
 * @param username - username of the user
 * @returns data - response from the db as IGetAttemptByUsername
 */
export const getAttemptByUsername = async (username: string | null) => {
    try{
        if (!username) {
            throw new Error('Username is required')
        }
        const response = await fetch(`http://localhost:8080/api/attempts/${username}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()

        return data as IGetAttemptByUsername
    } catch (e) {
        throw new Error('Error getting attempt by username')
    }
}

/**
 * 
 * @param attempt - IResult object
 * @returns 
 */
export const generateFeedback = async (attempt: IResult | undefined) => {
    try {
        if (!attempt) {
            throw new Error('Attempt is undefined')
        }

        const response = await 
        fetch(`http://localhost:8080/api/attempts/${attempt.username}/${attempt.attemptId}/${attempt.questionId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const data = await response.json() as IFeedbackResponse
        
        return data
    } catch (e) {
        throw new Error('Error getting feedback for attempt')
    }
}