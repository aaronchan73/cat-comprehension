import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

    /**
     * @description - Function to get the exercises and choosing an excersie to set - will be usedl in next sprint
     */
    const getExercise = async () => {
        try {
            const data = await getExercises()
            const randomNumber = Math.random()
            setCode(data.questions[0].code)
            setName(data.questions[0].name)
        } catch (e) {
            console.log(e)
        }
    }

    /**
     * @description - Function to set the exercise by id and setting states for code and name
     * @param id - id of the exercise
     */
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

    /**
     * @description - Function to change the question by incrementing the question id
     */
    const handleChangeQuestion = () => {
        const newQuestion = String(Number(questionId) + 1)

        console.log(newQuestion)

        if (newQuestion === '4') {
            setExerciseById('1')
        } else {
            setExerciseById(newQuestion)
        }
    }

    /**
     * @description - Function to handle the submit button click
     */
    const handleOnSubmit = async () => {
        try {
            setLoading(true)
            const response = await addAttempt(userName, summaryDescription, questionId)
            setLoading(false)

            if (response.message === 'Tests successfully ran') {
                navigate(`/student/resultsPage?username=${userName}&attemptId=${response.result.attemptId}&questionId=${questionId}`)
            } else {
                setError('Error submitting attempt')
            }
        } catch (e) {
            setError(`Error submitting attempt: ${e}`)
        }
    }

    /**
     * @description - useEffect to set the states + render UI on page mount
     */
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
                        <Button
                            disabled={loading}
                            sx={{
                                color: 'black',
                            }} 
                            onClick={handleChangeQuestion}>{name}</Button>
                    </Tooltip>
                    <CodeBox language="python" code={code} name={name} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', height: '630px',}}>
                    <div style={{ height: '80%%', marginBottom:'25px'  }}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '20px',
                                borderRadius: '10px',
                                backgroundColor: '#f0f0f0',
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
                        disabled={loading}
                        sx={{
                            alignContent: 'right',
                            backgroundColor: '#f0f0f0',
                            color: 'black',
                            visibility: summaryDescription ? 'visible' : 'hidden',
                            padding: '10px',
                            transition: 'background-color 0.3s, transform 0.3s',
                            '&:hover': {
                                backgroundColor: '#e0e0e0',
                                color: 'black'
                            }
                        }}
                    >
                        {loading ? 'Running Test Cases...' : 'Submit Attempt'}
                    </Button>
                    {error && <Alert severity="error">{error}</Alert>}

                </div>
            </div>
        </div>
    )
}