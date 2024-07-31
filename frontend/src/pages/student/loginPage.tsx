import { Alert, Button, TextField } from '@mui/material';
import  { useState } from 'react';
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

    /**
     * @description - Function to navigate back to the sign up page
     */
    const returnToSignUp = () => {
        navigate("/student/catNamePage");
    }

    return (
        <div>
            <h1 style={{
                margin: 0,
                lineHeight: '2',
                padding: '20px'
            }}>Enter Your Username + StudentID</h1>
            <div className="inputContainer">
                <TextField
                    sx={{
                        marginBottom: '10px'
                    }}
                    type="text"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    label="User Name"
                    variant="filled"
                    className="customTextField"
                />
                <TextField
                    sx={{
                        marginBottom: '30px'
                    }}
                    type="text"
                    value={studentID}
                    onChange={(e) => setStudentID(e.target.value)}
                    label="Student ID"
                    variant="filled"
                    className="customTextField"
                />
                <Button
                    sx={{
                        fontSize: '1rem',
                        padding: '10px 20px',
                        border: '1px solid #ccc',
                        borderRadius: '1rem',
                        backgroundColor: '#f0f0f0',
                        color: 'black',
                        transition: 'background-color 0.3s, transform 0.3s',
                        '&:hover': {
                            backgroundColor: '#e0e0e0',
                            color: 'black'
                        }
                    }}
                    onClick={loginStudent} className="customButton">
                    Login
                </Button>
            </div>
            <Button
                sx={{
                    marginBottom: '20px',
                    fontSize: '1rem',
                    padding: '10px 20px',
                    border: '1px solid #ccc',
                    borderRadius: '1rem',
                    backgroundColor: '#f0f0f0',
                    color: 'black',
                    transition: 'background-color 0.3s, transform 0.3s',
                    '&:hover': {
                        backgroundColor: '#e0e0e0',
                        color: 'black'
                    }
                }}
                onClick={returnToSignUp}>
                Return to Sign up
            </Button>
            {error && !success && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
        </div>
    )
}