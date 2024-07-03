import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import CodeBox from '../../components/codeBox'

const exampleCode = 'def function(test):\n return test + 1'

export default function ExercisePage() {
    const navigate = useNavigate()

    return (
        <div>
            <h1>
                Exercise Page
            </h1>
            <CodeBox language="python" code={exampleCode} />
        </div>
    )
    

}