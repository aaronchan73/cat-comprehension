import { v4 as uuidv4 } from 'uuid'
import { IAddAttemptResposne } from '../types/AddAttempt'
import { IResult } from '../types/IResult'

const randomId = uuidv4()

export const addAttempt = async (username: string, description: string, questionId: string) => {
    try {
        // generate random attempt id
        const attemptId = uuidv4()
        const response = await fetch(`http://localhost:8080/api/attempts/${attemptId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, description, questionId })
        })
        const data = await response.json()
        return data as IAddAttemptResposne
    } catch (e) {
        throw new Error('Error adding attempt')
    }
}

export const getAttemptByUsername = async (username: string | null) => {
    try{
        if (!username) {
            throw new Error('Username is required')
        }
        const response = await fetch(`http://locahost:8080/api/attempts/${username}`)
        const data = await response.json()
        return data as IResult[]
    } catch (e) {
        throw new Error('Error getting attempt by username')
    }
}