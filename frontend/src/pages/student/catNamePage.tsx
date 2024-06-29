import React, {useState, useEffect} from 'react';
import '../../styles/catNamePage.css'

export default function CatNamePage() {
    const [catName, setCatName] = useState<string>('')
    

    // TODO post request to save the cat name
    const saveName = async () => {
        // save the cat name to the server
        // navigate to the next page
    
    }

    useEffect(() => {
        console.log(catName)
    }, [catName])

    return (
        <div>
            <h1>
                What is your cat's name?
            </h1>
            <div className = "inputContainer">
                <input type="text" value={catName} onChange={(e) => {setCatName(e.target.value)}}/>
                <button onClick={() => {saveName()}}>
                    Submit
                </button>
            </div>
        </div>
    )
}