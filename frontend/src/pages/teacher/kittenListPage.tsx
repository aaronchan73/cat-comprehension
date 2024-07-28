import { useState, useEffect } from "react";
import { getUsers } from "../../services/users";
import { getAttemptByUsername } from "../../services/attempts";
import { getExercises } from "../../services/exercises";
import "../../styles/kittenListPage.css";
import { Button, Box } from "@mui/material";
import { IUser } from "../../types/IUser";
import { IQuestion } from "../../types/IQuestion";
import CodeBox from "../../components/codeBox";
import { IGetAttemptByUsername } from "../../types/IGetAttemptByUsername";
import { IResult } from "../../types/IResult";
import { LineChart } from '@mui/x-charts';

export default function KittenListPage() {
  const initialAttemptState: IGetAttemptByUsername = {
    userAttempts: [],
    message: "",
  };

  const [users, setUsers] = useState<IUser[]>([]);
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<IGetAttemptByUsername>(initialAttemptState);
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [attemptIndex, setAttemptIndex] = useState<number>(0);
  const [currentAttempts, setCurrentAttempts] = useState<IResult[]>([]);
  const [xAxis, setXAxis] = useState<number[]>([]);
  const [values, setValues] = useState<number[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();

    const fetchQuestions = async () => {
      try {
        const data = await getExercises();
        setQuestions(data.questions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, []);

  const handleButtonClick = async (username: string) => {
    setSelectedUsername(username);
    try {
      const attemptsData = await getAttemptByUsername(username);
      setAttempts(attemptsData);
      setQuestionIndex(0);
      setAttemptIndex(0);
      updateCurrentAttempts(0, attemptsData, questions);

      const currentQuestionId = questions[0]?.id.toString();
      if (currentQuestionId) {
        const filteredAttempts = attemptsData.userAttempts.filter(
          (attempt) => attempt.questionId === currentQuestionId
        );
        const xAxisValues = filteredAttempts.map((_, index) => index + 1);
        const yAxisValues = filteredAttempts.map(attempt => attempt.numPassed);
        setXAxis(xAxisValues);
        setValues(yAxisValues);
      }
    } catch (e) {
      console.error("Error fetching attempts:", e);
    }
  };

  const handleTitleClick = () => {
    if (questions.length > 0) {
      const newIndex = (questionIndex + 1) % questions.length;
      setQuestionIndex(newIndex);
      setAttemptIndex(0);
      updateCurrentAttempts(newIndex, attempts, questions);
    }
  };

  const updateCurrentAttempts = (
    newQuestionIndex: number,
    attemptsData: IGetAttemptByUsername,
    questionsData: IQuestion[]
  ) => {
    const questionId = questionsData[newQuestionIndex]?.id.toString();
    if (questionId && attemptsData.userAttempts && attemptsData.userAttempts.length > 0) {
      const filteredAttempts = attemptsData.userAttempts.filter(
        (a) => a.questionId === questionId
      );
      setCurrentAttempts(filteredAttempts);

      const xAxisValues = filteredAttempts.map((_, index) => index + 1);
      const yAxisValues = filteredAttempts.map(attempt => attempt.numPassed);
      setXAxis(xAxisValues);
      setValues(yAxisValues);
    } else {
      setCurrentAttempts([]);
      setXAxis([]);
      setValues([]);
    }
  };

  const handleNextAttempt = () => {
    if (currentAttempts.length > 0) {
      setAttemptIndex((prev) => (prev + 1) % currentAttempts.length);
    }
  };

  const currentQuestion = questions[questionIndex];
  const currentAttempt = currentAttempts[attemptIndex] || {
    attemptId: 0,
    questionId: currentQuestion ? currentQuestion.id.toString() : "",
    username: selectedUsername || "",
    description: "",
    generateCode: "",
    numPassed: 0,
  };

  return (
    <div className="kittenListPage">
      <div className="infoContainer">
        <div className="leftBox">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "20px",
              borderRadius: "10px",
              backgroundColor: "#f9f9f9",
              width: "700px",
              height: "800px",
            }}
          >
            <h2 className="title" style={{ margin: 0, alignSelf: "center" }}>
              Kitten List
            </h2>
            {users.map((user) => (
              <Button
                key={user.studentId}
                onClick={() => handleButtonClick(user.username)}
                sx={{
                  justifyContent: "flex-start",
                  width: "100%",
                  color: "#000",
                  padding: "10px",
                }}
              >
                {user.username}
              </Button>
            ))}
          </Box>
        </div>
        <div className="rightBox">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              textAlign: "center",
              padding: "20px",
              borderRadius: "10px",
              backgroundColor: "#f9f9f9",
              width: "700px",
              height: "800px",
            }}
          >
            {selectedUsername && currentQuestion ? (
              <div>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    marginBottom: "10px",
                  }}
                >
                  <h2 className="username" style={{ marginRight: "70px" }}>
                    {selectedUsername}
                  </h2>
                  <h2
                    style={{ marginLeft: "70px", cursor: "pointer" }}
                    onClick={handleTitleClick}
                    className="username"
                  >
                    {currentQuestion.name}
                  </h2>
                </Box>
                <p style={{ textAlign: "center" }}>
                  Click question name to see other questions
                </p>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "200px",
                    maxWidth: "550px",
                    marginBottom: "10px",
                    padding: "10px",
                    borderRadius: "10px",
                    backgroundColor: "#f0f0f0",
                  }}
                >
                  {currentAttempt && (
                    <CodeBox
                      language="python"
                      code={
                        currentAttempt.generateCode ||
                        "Student has not attempted question yet"
                      }
                      name={null}
                    />
                  )}
                </Box>
                <Button
                  onClick={handleNextAttempt}
                  disabled={currentAttempts.length <= 1}
                  sx={{ marginTop: "10px", padding: "5px 40px", fontSize: "0.5rem" }}
                  variant="contained"
                  color="primary"
                >
                  Next Attempt
                </Button>
                <p>Test Cases Passed: {currentAttempt.numPassed}</p>
                {xAxis.length >= 2 && values.length >= 2 && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    minHeight: "200px",
                    maxWidth: "550px",
                    padding: "10px",
                    borderRadius: "10px",
                    backgroundColor: "#f0f0f0",
                    marginTop: "10px",
                  }}
                >
                  <LineChart
                    width={500}
                    height={300}
                    xAxis={[{ data: xAxis, label: 'Attempt Number' }]}
                    series={[{ data: values, label: 'Test Cases Passed' }]}
                    grid={{ vertical: true, horizontal: true }}
                  />
                  </Box>
                    )}
              </div>
            ) : (
              <h2>Select a student</h2>
            )}
          </Box>
        </div>
      </div>
    </div>
  );
}
