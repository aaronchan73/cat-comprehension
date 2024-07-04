import { IUser } from "../types/IUser";

export const getUsers = async () => {
    try {
        const response = await fetch('http://localhost:8080/api/users')
        const data = await response.json()
        return data
    } catch (e) {
        throw new Error('Error getting users')
    }
}

export const addUser = async (user: IUser) => {
    try {
        const response = await fetch('http://localhost:8080/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        const data = await response.json()
        return data
    } catch (e) {
        throw new Error('Error adding user')
    }
}