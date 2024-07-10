

export const addAttempt = async (summaryDescription: string, questionId: string, username: string) => {
    try {
        const response = await fetch('http://localhost:8080/api/attempts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ summaryDescription, questionId, username })
        })
        const data = await response.json()
        return data
    } catch (e) {
        throw new Error('Error adding attempt')
    }
}