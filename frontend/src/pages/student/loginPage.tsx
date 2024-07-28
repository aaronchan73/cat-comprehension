import { Alert, Button, TextField } from '@mui/material';
import react, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers } from '../../services/users';
import { IUser } from '../../types/IUser';

export default function LoginPage() {
    const [catName, setCatName] = useState<string>('')
    const [studentID, setStudentID] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [success, setSuccess] = useState<string>('')
    const navigate = useNavigate()

    /**
     * @description - Function to save the student to the db
     */
    const loginStudent = async () => {
        const response = await getUsers()
        const users = response.users

        const user = users.find((user: IUser) => user.username === catName && user.studentId === Number(studentID))
        if (user === undefined) {
            setError('User not found. Please sign up first.');
        } else {
            setSuccess('Login successful! Redirecting to exercise page...');
            setTimeout(() => { navigate(`/student/exercisePage?username=${catName}`); }, 3000);
        }
    }

    const returnToSignUp = () => {
        navigate("/student/catNamePage");
    }

    useEffect(() => {
    }, [catName, error])

    return (
        <div>
            <h1 style={{
                    margin: 0,
                    lineHeight: '2',
                    padding: '20px'
                }}>Enter Your Username + StudentID</h1>
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
                <Button onClick={loginStudent} className="customButton">
                    Login
                </Button>
                {error && 
                <Button onClick={returnToSignUp}>Return to Sign up</Button>
                }
            </div>
            {error && !success && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
        </div>
    )
}