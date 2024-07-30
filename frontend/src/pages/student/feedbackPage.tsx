import { Box, Button, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function FeedbackPage() {
    const [feedback, setFeedback] = useState<string>('No feedback available')
    
    const location = useLocation()
    const navigate = useNavigate()

    /**
     * @description - UseEffect to set the feedback from the location state
     */
    useEffect(() => {
        if (location.state && location.state.feedback) {
            setFeedback(location.state.feedback)
        }
    }, [location.state])

    /**
     * @description - Function to handle retry button click
     */
    const handleRetry = () => {
        const searchParams = new URLSearchParams(location.search)
        const username = searchParams.get('username')
        navigate(`/student/exercisePage?username=${username}`)
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height:'100%'}}>
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
                    height: '650px',
                }}
            >
                <Typography variant="h6">AI Generated Feedback:</Typography>
                <Box
                    sx={{
                        padding: '10px',
                        borderRadius: '10px',
                        backgroundColor: '#d3d3d3',
                        width: '100%', 
                        maxWidth: '400px', 
                        textAlign: 'left', 
                        height: '90%',
                        maxHeight: '500px',
                        overflowY:'auto',
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontSize: '1em',
                            alignContent: 'left',
                            overflowWrap: 'break-word',
                            overflowY: 'auto',
                        }}
                    >{feedback}</Typography>
                </Box>
                    <Button
                    sx={{
                        width: '200px',
                        alignSelf: 'center',
                        marginTop: '20px',
                        backgroundColor: '#f0f0f0',
                        color: 'black',
                        '&:hover': {
                            backgroundColor: '#d3d3d3',
                        }
                    }}
                    onClick={handleRetry}
                > Retry</Button>
            </Box>
        </div>
    )
}
