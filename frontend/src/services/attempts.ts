import { v4 as uuidv4 } from 'uuid'

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
        return data
    } catch (e) {
        throw new Error('Error adding attempt')
    }
}