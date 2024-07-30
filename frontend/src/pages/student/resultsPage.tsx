import { Box, Button, List, ListItem, Tooltip, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getAttemptByUsername, generateFeedback } from '../../services/attempts'
import { IResult } from '../../types/IResult'
import CodeBox from '../../components/codeBox'
import { LineChart } from '@mui/x-charts'
import { ITestCase } from '../../types/ITestCase'


const codeString = `
/**
 * This is a function that takes in an array of numbers and a target number,
 * and will return a list of two indices of the numbers that sum up to the target number.
 */
function twoSum(nums, target) {
  const numToIndex = {}
  for (let index = 0 index < nums.length index++) {
    const complement = target - nums[index]
    if (complement in numToIndex) {
      return [numToIndex[complement], index]
    }
    numToIndex[nums[index]] = index
  }
  return [] // If there are no two numbers that sum up to the target number, return an empty array
}
`

export default function ResultsPage() {
    const [analysis, setAnalysis] = useState<IResult>()
    const location = useLocation()
    const [code, setCode] = useState<string>('')
    const [xAxis, setXAxis] = useState<number[]>([])
    const [values, setValues] = useState<number[]>([])
    const [loadingFeedback, setLoadingFeedback] = useState<boolean>(false)
    const [testCases, setTestCases] = useState<ITestCase[]>([])
    const [feedback, setFeedback] = useState<string>('')
    const [errorFeedback, setErrorFeedback] = useState<string>('')

    const navigate = useNavigate()

    /**
     * @description - Function to get the attempt by username and setting states for analysis and code
     */
    const getAttempt = async () => {
        try {
            const searchParams = new URLSearchParams(location.search)
            const username = searchParams.get('username')
            const attemptId = searchParams.get('attemptId')
            const questionId = searchParams.get('questionId')

            const response = await getAttemptByUsername(username)
            let xAxisValues = []
            let yAxisValues = []

            // ensures filtered attempts of the certain question
            console.log(response.userAttempts)
            const filteredAttempts = response.userAttempts.filter(attempt => attempt.questionId === questionId)
            console.log(filteredAttempts)

            for (var i = 0; i < filteredAttempts.length; i++) {

                const attemptNumber = i + 1
                xAxisValues.push(attemptNumber)
                yAxisValues.push(filteredAttempts[i].numPassed)
                const attempt = filteredAttempts[i]
                if (attempt.attemptId === attemptId) {
                    setAnalysis(attempt)
                    setCode(attempt.generateCode)
                    setTestCases(attempt.testResults)
                }
            }
            setXAxis(xAxisValues)
            setValues(yAxisValues)
        } catch (e) {
            console.log(e)
        }
    }

    /**
     * @description - Function to generate feedback and navigate to feedback page
     */
    const getFeedback = async () => {
        try {
            setLoadingFeedback(true)
            const response = await generateFeedback(analysis)

            if (response.feedback) {
                setFeedback(response.feedback)
                setLoadingFeedback(false)
                const username = getSearchParams().username

                navigate(`/student/feedbackPage?username=${username}`, {
                    state: { feedback: response.feedback }
                })
            } else {
                setErrorFeedback('Error generating feedback')
                setLoadingFeedback(false)
            }
        } catch (e) {
            console.log(e)
            setErrorFeedback('Error generating feedback')
        } finally {
            setLoadingFeedback(false)
        }
    }

    const handleTestCases = () => {
        const searchParams = getSearchParams()
        const userTestCases = { username: searchParams.username, testCases: testCases, questionId: searchParams.questionId, attemptId: searchParams.attemptId }
        navigate(`/student/testCasesPage`, {
            state: userTestCases
        })
    }


    /**
     * 
     * @returns username from the URL
     */
    const getSearchParams = () => {
        const searchParams = new URLSearchParams(location.search)
        const username = searchParams.get('username')
        const attemptId = searchParams.get('attemptId')
        const questionId = searchParams.get('questionId')

        return { username, attemptId, questionId }
    }

    /** 
     * @description - Function to navigate to the exercise page with same username when retry button is clicked
    */
    const handleRetry = () => {
        const searchParams = getSearchParams()
        navigate(`/student/exercisePage?username=${searchParams.username}`)
    }

    /**
     * @description - useEffect to get the attempt by username on page mount
     */
    useEffect(() => {
        getAttempt()
    }, [])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', }}>
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
                        height: '600px',
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
                            <Typography variant="h6" style={{ textAlign: 'center' }}>Analysis</Typography>
                        </Box>
                        <List>
                            <ListItem>
                                User: {analysis?.username}
                            </ListItem>
                            <ListItem>
                                Result: {analysis?.message}
                            </ListItem>
                            <ListItem>
                                Attempt #: {xAxis.length}
                            </ListItem>
                            <Tooltip title="Click to view test case results" arrow>
                                <Button onClick={handleTestCases} disabled={loadingFeedback}>Test Cases Passed: {analysis?.numPassed}</Button>
                            </Tooltip>
                        </List>
                        {xAxis.length >= 2 && values.length >= 2 && <LineChart // Only render the line chart if there are at least 2 attempts - for the feedback workflow
                            width={500}
                            height={300}
                            xAxis={[{ data: xAxis, label: 'Attempt Number' }]}
                            series={[
                                {
                                    data: values,
                                    label: 'Test Cases Passed',
                                },
                            ]}
                            grid={{ vertical: true, horizontal: true }}
                        >
                        </LineChart>}
                        {!analysis?.success &&
                            <Tooltip title="Click to generate feedback" arrow>
                                <Button
                                    onClick={getFeedback}
                                    disabled={loadingFeedback}
                                    style={{
                                        width: '200px',
                                    }}
                                >{loadingFeedback ? 'Generating...' : 'Generate Feedback'}</Button>
                            </Tooltip>
                        }
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
                        height: '600px',
                    }}
                >
                    <Box
                        sx={{
                            padding: '10px',
                            borderRadius: '10px',
                            backgroundColor: '#d3d3d3',
                            width: '100%',
                            maxWidth: '400px',
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="h6">Your Code</Typography>
                        <CodeBox language="python" code={code} name={null} />
                    </Box>
                </Box>
            </div>
            <Button
                disabled={loadingFeedback}
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
            > Try New Exercise</Button>
        </div>
    )
}
