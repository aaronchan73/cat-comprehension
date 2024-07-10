import { Box, List, ListItem, ListItemText, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { IAnalysis } from '../../types/IAnalysis'
import { useLocation } from 'react-router-dom'
import { getAttemptByUsername } from '../../services/attempts'
import { IResult } from '../../types/IResult'
import CodeBox from '../../components/codeBox'

export default function ResultsPage() {
    const [analysis, setAnalysis] = useState<IResult>()
    const location = useLocation()
    const [code, setCode] = useState<string>('')

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

    useEffect(() => {
        getAttempt()
    }, [])

    return (
        <div style={{ display: 'flex', flexDirection: 'row', padding: '20px' }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    borderRadius: '10px', // Rounded corners
                    backgroundColor: '#f0f0f0', // Light grey background
                    marginTop: '20px',
                    marginRight: '20px', // Space between boxes
                    width: '500px',
                    height: '500px',
                }}
            >
                <div style={{ display: 'flex', flexDirection:'column'}}>
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
                    borderRadius: '10px', // Rounded corners
                    backgroundColor: '#f0f0f0', // Light grey background
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

    )
}
