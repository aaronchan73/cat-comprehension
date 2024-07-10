import { Box, List, ListItem, ListItemText, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { IAnalysis } from '../../types/IAnalysis'
import { useLocation } from 'react-router-dom'
import { getAttemptByUsername } from '../../services/attempts'
import { IResult } from '../../types/IResult'

export default function ResultsPage() {
    const [analysis, setAnalysis] = useState<IResult>()
    const location = useLocation()
    const [code, setCode] = useState<string>('')

    const getAttempt = async () => {
        try {
            const searchParams = new URLSearchParams(location.search);
            const username = searchParams.get('username');
            const attemptId = searchParams.get('attemptId');
            const response = await getAttemptByUsername(username)

            console.log(response)
            
            for (let attempt of response) {
                if (attempt.attemptId === attemptId) {
                    setAnalysis(attempt)
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
                <div style={{ display: 'flex',}}>
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
                            Test Cases Passed : {analysis?.numPassed}
                        </ListItem>
                        <ListItem>
                        </ListItem>
                        <ListItem>
                        </ListItem>
                        <ListItem>
                        </ListItem>
                        <ListItem>
                        </ListItem>
                        <ListItem>
                        </ListItem>
                        <ListItem>
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
                <Box
                    sx={{
                        padding: '10px',
                        borderRadius: '10px',
                        backgroundColor: '#d3d3d3',
                        marginBottom: '10px'
                    }}
                >
                    <Typography variant="h6">Your Code</Typography>
                </Box>

            </Box>
        </div>

    )
}
