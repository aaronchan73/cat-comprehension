import { v4 as uuidv4 } from 'uuid'
import { IAddAttemptResponse } from '../types/AddAttempt'
import { IGetAttemptByUsername } from '../types/IGetAttemptByUsername'

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
        return data as IAddAttemptResponse
    } catch (e) {
        throw new Error('Error adding attempt')
    }
}

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
        
        console.log(data)

        return data as IGetAttemptByUsername
    } catch (e) {
        throw new Error('Error getting attempt by username')
    }
}