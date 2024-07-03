import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import CodeBox from '../../components/codeBox'
import { getExercises, getExerciseById } from '../../services/getExercises';

export default function ExercisePage() {
    const [code, setCode] = useState<string>('')
    const navigate = useNavigate()

    const getExercise = async () => {
        try{
            const data = await getExercises()
            console.log(data)
            setCode(data.questions[0].code)
        } catch (e) {
            console.log(e)
        }
    }

    const setExerciseById = async (id: string) => {
        try{
            const data = await getExerciseById(id)
            console.log(data)
            setCode(data.question.code)
        } catch (e) {
            console.log(e)
        }
    
    }

    useEffect(() => {
        setExerciseById('2')
    }, [code])

    return (
        <div>
            <h1>
                Exercise Page
            </h1>
            <CodeBox language="python" code={code} />
        </div>
    )
    

}