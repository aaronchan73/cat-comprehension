import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/catNamePage.css'
import { IUser } from '../../types/IUser';
import { addUser } from '../../services/users';
import Alert from '@mui/material/Alert';
import { Button, TextField } from '@mui/material';


export default function CatNamePage() {
    const [catName, setCatName] = useState<string>('')
    const [studentID, setStudentID] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [success, setSuccess] = useState<string>('')
    const navigate = useNavigate()

    /**
     * @description - Function to save the student to the db
     */
    const saveStudent = async () => {
        const data = { studentId: Number(studentID), username: catName } as IUser
        const reponse = await addUser(data)
        console.log(reponse)

        if (reponse.message !== 'User added successfully') {
            setError(reponse.message)
        }
        else {
            setSuccess(reponse.message + ': Redirecting to exercise page...');
            setTimeout(() => { navigate(`/student/exercisePage?username=${catName}`); }, 3000);
        }
    }

    /**
     * @description - Function to navigate to the login page
     */
    const goToLogin = () => {
        navigate("/student/loginPage");
    }

    return (
        <div>
            <div className="headerContainer">
                <h1 style={{
                    margin: 0,
                    lineHeight: '2',
                }}>Sign Up + Create a Username</h1>
            </div>
            <div className="inputContainer">
                <TextField
                    sx={{
                        marginBottom: '10px'
                    }}
                    type="text"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    label="Username"
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
                        cursor: 'pointer',
                        transition: 'background-color 0.3s, transform 0.3s',
                        '&:hover': {
                            backgroundColor: '#e0e0e0',
                            color: 'black'
                        }
                    }}
                    onClick={saveStudent} className="customButton">
                    Sign up
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
                    cursor: 'pointer',
                    transition: 'background-color 0.3s, transform 0.3s',
                    '&:hover': {
                        backgroundColor: '#e0e0e0',
                        color: 'black'
                    }
                }}
                onClick={goToLogin}>Already a Cat?</Button>
            {error && !success && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
        </div>
    )
}