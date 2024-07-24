import { Box, Button, List, ListItem, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'


const sampleFeedback = `Sure, I can explain dick can be improved based on the given test cases. Here are some potential improvements: Test Cases: [object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object] 1. Adding additional test cases to cover various input scenarios: - Test case 1: nums = [1,2,3], target = 6 TwoSum(nums, target) => [[1,0],[2,1],[3,2]] - Test case 2: nums = [4,9,1,2,3], target = 8 TwoSum(nums, target) => [[9,0],[1,1],[2,2],[3,3]] - Test case 3: nums = [-1,-2,3,4], target = 6 TwoSum(nums, target) => [] Testing the function under these additional test cases will ensure that it handles different input scenarios and does not break when faced with unexpected situations.`

export default function FeedbackPage() {
    const location = useLocation()
    const navigate = useNavigate()
    const [feedback, setFeedback] = useState<string>('No feedback available')

    useEffect(() => {
        if (location.state && location.state.feedback) {
            setFeedback(location.state.feedback)
        }
    }, [location.state])

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
                        width: '100%', // Set width to 100% to take the full width of the parent box
                        maxWidth: '400px', // Set a maximum width for the inner box
                        textAlign: 'left', // Center the text inside the inner box
                        height: '90%',
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontSize: '1em',
                            alignContent: 'left',
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
