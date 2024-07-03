import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import CodeBox from '../../components/codeBox'
import { getExercises } from '../../services/getExercises';

const exampleCode = "from typing import List\n\ndef twoSum(nums: List[int], target: int) -> List[int]:\n    numToIndex = {}\n    for index, num in enumerate(nums):\n        complement = target - num\n        if complement in numToIndex:\n            return [numToIndex[complement], index]\n        numToIndex[num] = index\n    return []\n\n# Example usage:\nnums = [2, 7, 11, 15]\ntarget = 9\nresult = twoSum(nums, target)\nprint(result)  # Output: [0, 1]\n"

export default function ExercisePage() {
    const [code, setCode] = useState<string>('')
    const navigate = useNavigate()

    const getExercise = async () => {
        try{
            const data = await getExercises()
            console.log(data)
            setCode(data[0].code)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        getExercise()
    }, [])

    return (
        <div>
            <h1>
                Exercise Page
            </h1>
            <CodeBox language="python" code={code} />
        </div>
    )
    

}