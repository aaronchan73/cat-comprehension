import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/catNamePage.css'
import { IUser } from '../../types/IUser';
import { addUser } from '../../services/users';
import Alert from '@mui/material/Alert';
import { Button, FormLabel, Input, TextField } from '@mui/material';


export default function CatNamePage() {
    const [catName, setCatName] = useState<string>('')
    const [studentID, setStudentID] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [success, setSuccess] = useState<string>('')
    const navigate = useNavigate()


    // TODO post request to save the cat name
    const saveStudent = async () => {
        const data = { studentId: Number(studentID), username: catName } as IUser
        const reponse = await addUser(data)
        console.log(reponse)

        if (reponse.message !== 'User added successfully') {
            setError(reponse.message)
        }
        else {
            setSuccess(reponse.message)
            setTimeout(() => { navigate(`/student/exercisePage?username=${catName}`); }, 3000);
        }
    }

    useEffect(() => {
    }, [catName, error])

    return (
        <div>
            <h1>What is your name?</h1>
            <div className="inputContainer">
                <TextField
                    type="text"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    label="User Name"
                    variant="filled"
                    className="customTextField"
                />
                <TextField
                    type="text"
                    value={studentID}
                    onChange={(e) => setStudentID(e.target.value)}
                    label="Student ID"
                    variant="filled"
                    className="customTextField"
                />
                <Button onClick={saveStudent} className="customButton">
                    Submit
                </Button>
            </div>
            {error && !success && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
        </div>
    )
}