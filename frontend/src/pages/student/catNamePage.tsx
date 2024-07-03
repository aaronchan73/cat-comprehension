import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/catNamePage.css'

export default function CatNamePage() {
    const [catName, setCatName] = useState<string>('')
    const [studentID, setStudentID] = useState<string>('')
    const [error, setError] = useState<string>('')
    const navigate = useNavigate()
    

    // TODO post request to save the cat name
    const saveStudent = async () => {
        // save the cat name to the server
        // navigate to the next page
        console.log(catName)
        console.log(studentID)
        navigate('/student/exercisePage')
    }

    useEffect(() => {
    }, [catName])

    return (
        <div>
            <h1>
                What is your name?
            </h1>
            <div className = "inputContainer">
                <label>Username:</label>
                <input type="text" value={catName} onChange={(e) => {setCatName(e.target.value)}}/>
                <label>Student ID:</label>
                <input type="text" value={studentID} onChange={(e) => {setStudentID(e.target.value)}}/>
                <button onClick={() => {saveStudent()}}>
                    Submit
                </button>
            </div>
        </div>
    )
}