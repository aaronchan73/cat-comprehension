import { useState, useEffect } from "react";
import "../../styles/kittenListPage.css";
import { Button, Box, List, ListItem, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { ITestCase } from "../../types/ITestCase";

export default function TestCasesPage() {
    const location = useLocation()
    const navigate = useNavigate()
    const [userName, setUserName] = useState<string>('')
    const [testCases, setTestCases] = useState<ITestCase[]>([])
    const [testCase, setTestCase] = useState<ITestCase>()

    useEffect(() => {
        if (location.state && location.state.testCases && location.state.username) {
            const { testCases, username } = location.state
            const testCasesWithNumber = testCases.map((testCase: ITestCase, index: number) => {
                return {
                    ...testCase,
                    test: `Test ${index + 1}: ` + testCase.test
                }
            })
            setTestCases(testCasesWithNumber)
            setUserName(username)
        } else {
            setUserName('User not found, navigate back to the results page')
        }
    }, [location.state])

    const handleButtonClick = (test: string) => {
        const testCase = testCases.find((testCase) => testCase.test === test)
        setTestCase(testCase)
    }

    const handleReturn = () => {
        const { questionId, attemptId, username } = location.state
        navigate(`/student/resultsPage?username=${username}&attemptId=${attemptId}&questionId=${questionId}`)
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="infoContainer">
                <div className="leftBox">
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
                        <h2 className="title" style={{ margin: 0, alignSelf: "center" }}>
                            Test Cases:
                        </h2>
                        {testCases.map((testCase) => (
                            <Button
                                key={testCase.test}
                                onClick={() => handleButtonClick(testCase.test)}
                                sx={{
                                    justifyContent: "flex-start",
                                    width: "100%",
                                    color: "#000",
                                    padding: "10px",
                                }}
                            >
                                {testCase.test}
                            </Button>
                        ))}
                    </Box>
                </div>
                <div className="rightBox">
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
                        {testCase ? (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Box
                                    sx={{
                                        padding: '10px',
                                        borderRadius: '10px',
                                        backgroundColor: '#d3d3d3',
                                        marginBottom: '10px'
                                    }}
                                >
                                    <Typography variant="h6" style={{ alignContent: 'center', justifyContent: 'center' }}>{testCase.test}</Typography>
                                </Box>
                                <List>
                                    <ListItem>
                                        Input: {testCase.input}
                                    </ListItem>
                                    <ListItem>
                                        Output: {JSON.stringify(testCase.actualOutput)}
                                    </ListItem>
                                    <ListItem>
                                        Expected Output: {testCase.expectedOutput}
                                    </ListItem>
                                    <ListItem>
                                        Result: {testCase.passed ? 'Passed' : 'Failed'}
                                    </ListItem>
                                </List>
                            </div>
                        ) : (
                            <h2>Select a Test Case</h2>
                        )}
                    </Box>
                </div>
            </div>
            <Button
                onClick={handleReturn}
                sx={{
                    width: '300px',
                    alignSelf: 'center',
                    marginTop: '20px',
                    backgroundColor: '#f0f0f0',
                    color: 'black',
                    '&:hover': {
                        backgroundColor: '#d3d3d3',
                    }
                }}>Return to Results Page</Button>
        </div>
    );
}
