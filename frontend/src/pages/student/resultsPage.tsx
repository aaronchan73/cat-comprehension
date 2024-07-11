import { Box, Button, List, ListItem, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getAttemptByUsername } from '../../services/attempts'
import { IResult } from '../../types/IResult'
import CodeBox from '../../components/codeBox'

export default function ResultsPage() {
    const [analysis, setAnalysis] = useState<IResult>()
    const location = useLocation()
    const [code, setCode] = useState<string>('')
    const navigate = useNavigate()

    /**
     * @description - Function to get the attempt by username and setting states for analysis and code
     */
    const getAttempt = async () => {
        try {
            const searchParams = new URLSearchParams(location.search);
            const username = searchParams.get('username');
            const attemptId = searchParams.get('attemptId');

            console.log(username)
            const response = await getAttemptByUsername(username)

            console.log(response)

            for (let attempt of response.userAttempts) {
                if (attempt.attemptId === attemptId) {
                    setAnalysis(attempt)
                    setCode(attempt.generateCode)
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    /** 
     * @description - Function to navigate to the exercise page with same username when retry button is clicked
    */
    const handleRetry = () => {
        const searchParams = new URLSearchParams(location.search);
        const username = searchParams.get('username');
        navigate(`/student/exercisePage?username=${username}`)
    }

    /**
     * @description - useEffect to get the attempt by username on page mount
     */
    useEffect(() => {
        getAttempt()
    }, [])

    return (
        <div style={{display: 'flex', flexDirection: 'column',}}>
            <div style={{ display: 'flex', flexDirection: 'row', padding: '20px' }}>
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
                        marginRight: '20px',
                        width: '500px',
                        height: '500px',
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Box
                            sx={{
                                padding: '10px',
                                borderRadius: '10px',
                                backgroundColor: '#d3d3d3',
                                marginBottom: '10px'
                            }}
                        >
                            <Typography variant="h6">Analysis</Typography>
                        </Box>
                        <List>
                            <ListItem>
                                User: {analysis?.username}
                            </ListItem>
                            <ListItem>
                                Result: {analysis?.message}
                            </ListItem>
                            <ListItem>
                                Test Cases Passed : {analysis?.numPassed}
                            </ListItem>
                        </List>

                    </div>

                </Box>
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
                        height: '500px'
                    }}
                >
                    <div>
                        <Box
                            sx={{
                                padding: '10px',
                                borderRadius: '10px',
                                backgroundColor: '#d3d3d3',
                                marginBottom: '10px'
                            }}
                        >
                            <Typography variant="h6">Your Code</Typography>

                            <CodeBox language="python" code={code} name={null} />

                        </Box>
                    </div>


                </Box>
            </div>
                <Button
                sx={{
                    width: '100px',
                    alignSelf: 'center',
                    marginTop: '20px',
                    backgroundColor: '#f0f0f0',
                    color: 'black',
                    '&:hover': {
                        backgroundColor: '#d3d3d3',
                    }
                }}
                onClick={handleRetry}
                > Retry </Button>
        </div>

    )
}
