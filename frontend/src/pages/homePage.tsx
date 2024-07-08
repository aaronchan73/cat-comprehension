import React , { useState } from 'react';
import '../styles/homePage.css';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
// homepage has the questions
// has two buttons that go to seperate pages 
// - teacher flow is just seeing the list of kittens + can click into each student individually
// - student flow next page is to set your cat name
// 
export default function HomePage() {
    const navigate = useNavigate();

    const handleStudentClick = () => {
       navigate("/student/catNamePage")
    }

    const handleTeacherClick = () => {

    }
    return (
        <div>
            <h1>
                Which cat are you?
            </h1>
            <div className="homePageButtonContainer">
                <button className="homePageButton" onClick={handleStudentClick}>
                    Student Cat
                </button>
                <button className="homePageButton" onClick={handleTeacherClick}>
                    Teacher Cat
                </button>
            </div>
        </div>
    )
    
}