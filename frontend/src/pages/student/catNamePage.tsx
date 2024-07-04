import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/catNamePage.css'
import { IUser } from '../../types/IUser';
import { addUser } from '../../services/users';
import Alert from '@mui/material/Alert';


export default function CatNamePage() {
    const [catName, setCatName] = useState<string>('')
    const [studentID, setStudentID] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [success, setSuccess] = useState<string>('')
    const navigate = useNavigate()
    

    // TODO post request to save the cat name
    const saveStudent = async () => {
        const data = {studentId: Number(studentID), username: catName} as IUser
        const reponse = await addUser(data)
        console.log(reponse)

        if (reponse.message !== 'User added successfully') {
            setError(reponse.message)
        }
        else {
            setSuccess(reponse.message)
            setTimeout(() => {navigate('/student/exercisePage')} , 3000)
        }

    }

    useEffect(() => {
    }, [catName, error])

    return (
        <div>
            <h1>
                What is your name?
            </h1>
            <div className = "inputContainer">
                <label>Username:</label>
                <input type="text" value={catName} onChange={(e) => {setCatName(e.target.value)}}/>
                <label>Student ID:</label>
                <input type="text" value={studentID} onChange={(e) => {setStudentID(e.target.value)}}/>
                <button onClick={() => {saveStudent()}}>
                    Submit
                </button>
            </div>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
        </div>
    )
}