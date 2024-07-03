const apiURL = 'http://localhost:8080/api/'

export const getExercises = async () => {
    try {
        const response = await fetch(`${apiURL}questions`)
        const data = await response.json()
        return data
    } catch (e) {
        throw new Error('Error getting questions')
    }
}