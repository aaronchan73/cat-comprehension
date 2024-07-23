import { Box, Button, List, ListItem, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getAttemptByUsername, generateFeedback } from '../../services/attempts'
import { IResult } from '../../types/IResult'
import CodeBox from '../../components/codeBox'
import { LineChart } from '@mui/x-charts'
import { IFeedbackPageProps } from '../../types/IFeedbackProps'


export default function FeedbackPage() {
    const location = useLocation()
    const { feedback } = location.state || {};

    return (
        <div>
            <h1>Feedback</h1>
            <p>Feedback page</p>
            <Typography variant="h6">AI Generated Feedback: {feedback}</Typography>
        </div>

    )
}