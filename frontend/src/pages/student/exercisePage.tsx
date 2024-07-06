import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CodeBox from '../../components/codeBox'
import '../../styles/exercisePage.css'
import { getExercises, getExerciseById } from '../../services/exercises';
import SummaryBox from '../../components/summaryBox';
import { Button, Tooltip } from '@mui/material';

export default function ExercisePage() {
    const [code, setCode] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [questionId, setQuestionId] = useState<string>('1')

    const navigate = useNavigate()

    const getExercise = async () => {
        try {
            const data = await getExercises()
            console.log(data)
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
            console.log(data)
            setCode(data.question.code)
            setName(data.question.name)
        } catch (e) {
            console.log(e)
        }

    }

    const handleChangeQuestion = () => {
        const newQuestion = String(Number(questionId) + 1)
        console.log(newQuestion)
        setExerciseById(newQuestion)
    }

    useEffect(() => {
        setExerciseById(questionId)
    }, [code, questionId])

    return (
        <div className='exercisePage'>
            <div className='exerciseContainer'>
                <div>
                    <Tooltip title="Click title to change question" arrow>
                        <Button style={{ color: 'black' }} onChange={() => handleChangeQuestion()}>{name}</Button>
                    </Tooltip>                    
                    <CodeBox language="python" code={code} name={name} />
                </div>
                <SummaryBox />
            </div>
        </div>
    )


}