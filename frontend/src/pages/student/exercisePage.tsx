import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation} from 'react-router-dom';
import CodeBox from '../../components/codeBox'
import '../../styles/exercisePage.css'
import { getExercises, getExerciseById } from '../../services/exercises';
import { Alert, Box, Button, TextareaAutosize, Tooltip } from '@mui/material';
import { addAttempt } from '../../services/attempts';

export default function ExercisePage() {
    const [code, setCode] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [questionId, setQuestionId] = useState<string>('1')
    const [summaryDescription, setSummaryDescription] = useState<string>('')
    const [userName, setUsername] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)


    const navigate = useNavigate()
    const location = useLocation()

    const getExercise = async () => {
        try {
            const data = await getExercises()
            // case where we want to randomize the exercise
            const randomNumber = Math.random()
            setCode(data.questions[0].code)
            setName(data.questions[0].name)
        } catch (e) {
            console.log(e)
        }
    }

    const setExerciseById = async (id: string) => {
        try {
            const data = await getExerciseById(id)
            setCode(data.question.code)
            setName(data.question.name)
            setQuestionId(id)
        } catch (e) {
            console.log(e)
        }

    }

    const handleChangeQuestion = () => {
        const newQuestion = String(Number(questionId) + 1)
        setExerciseById(newQuestion)
    }

    const handleOnSubmit = async () => {
        // placeholder to pass in code Id, and summary descritpion to BE, username
        try {
            setLoading(true)
            const response = await addAttempt(userName, summaryDescription, questionId)
            setLoading(false)

            if (response.message === 'Tests successfully ran') {
                navigate(`/student/resultsPage?username=${userName}&attemptId=${response.result.attemptId}`)
            } else {
                setError('Error submitting attempt')
            }            
        } catch (e) {
            setError(`Error submitting attempt: ${e}`)
        }
    }


    useEffect(() => {
        setExerciseById(questionId)
        const searchParams = new URLSearchParams(location.search);
        const user = searchParams.get('username');
        if (user) {
            setUsername(user);
        }
    }, [questionId])

    return (
        <div className='exercisePage'>
            <div className='exerciseContainer'>
                <div>
                    <Tooltip title="Click title to change question" arrow>
                        <Button style={{ color: 'black' }} onClick={handleChangeQuestion}>{name}</Button>
                    </Tooltip>
                    <CodeBox language="python" code={code} name={name} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', height: '600px' }}>
                    <div style={{ height: '80%%' }}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '20px',
                                borderRadius: '10px', // Rounded corners
                                backgroundColor: '#f0f0f0', // Light grey background
                                marginTop: '20px',
                                width: '500px',
                                height: '500px'
                            }}
                        >
                            <TextareaAutosize
                                aria-label="explanation"
                                minRows={4}
                                placeholder="Explain the code in the code box in plain English"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    borderColor: 'grey',
                                    resize: 'none',
                                    height: '100%'
                                }}
                                value={summaryDescription}
                                onChange={(e) => setSummaryDescription(e.target.value)}
                            />
                        </Box>
                    </div>
                    <Button
                        onClick={handleOnSubmit}
                        style={{
                            alignContent: 'right',
                            color: 'black',
                            backgroundColor: 'lightblue',
                            visibility: summaryDescription ? 'visible' : 'hidden',
                            padding: '10px',
                        }}
                    >
                        Submit
                    </Button>
                    {error && <Alert severity="error">{error}</Alert>}
                </div>
            </div>
        </div>
    )
}