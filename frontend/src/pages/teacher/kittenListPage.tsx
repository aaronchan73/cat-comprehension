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

export default function KittenListPage() {
  const initialAttemptState: IGetAttemptByUsername = {
    userAttempts: [],
    message: "",
  };

  const [users, setUsers] = useState<IUser[]>([]);
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);
  const [attempts, setAttempts] =
    useState<IGetAttemptByUsername>(initialAttemptState);
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState<number>(0);

  useEffect(() => {
    /**
     * @description - fetch users from API
     */
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();

    /**
     * @description - fetch questions from API
     */
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

  /**
   * @description - handle button click to fetch attempts for a selected user
   */
  const handleButtonClick = async (username: string) => {
    setSelectedUsername(username);
    try {
      const attemptsData = await getAttemptByUsername(username);
      setAttempts(attemptsData);
      setQuestionIndex(0);
    } catch (e) {
      console.error("Error fetching attempts:", e);
    }
  };

  /**
   * @description - handle title click to switch to the next question
   */
  const handleTitleClick = () => {
    if (questions.length > 0) {
      setQuestionIndex((prev) => (prev + 1) % questions.length);
    }
  };

  /**
   * @description - get the current attempt for the selected question
   */
  const getCurrentAttempt = (questionId: number) => {
    if (!attempts.userAttempts || attempts.userAttempts.length === 0) {
      return {
        attemptId: 0,
        questionId,
        username: selectedUsername || "",
        description: "",
        generateCode: "",
        numPassed: 0,
      };
    }

    const attempt = attempts.userAttempts.find(
      (a) => a.questionId === questionId
    );
    return (
      attempt || {
        attemptId: 0,
        questionId,
        username: selectedUsername || "",
        description: "",
        generateCode: "",
        numPassed: 0,
      }
    );
  };

  /**
   * @description - get the current question and attempt
   */
  const currentQuestion = questions[questionIndex];
  const currentAttempt = currentQuestion
    ? getCurrentAttempt(currentQuestion.id)
    : null;

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
                {/* {currentAttempt && (
                  <p>
                    Number of Attempts:
                    {currentAttempt.attemptId === 0
                      ? 0
                      : attempts.attempt.length}
                  </p>
                )} */}
                <p>Test Cases Passed: {currentAttempt?.numPassed}</p>
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
