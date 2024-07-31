import { Button } from "@mui/material";
import "../styles/homePage.css";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  /**
   * @description Function to navigate to the student cat name page
   */
  const handleStudentClick = () => {
    navigate("/student/catNamePage");
  };

  /**
   * @description Function to navigate to the teacher kitten list page
   */
  const handleTeacherClick = () => {
    navigate("/teacher/kittenListPage");
  };
  
  return (
    <div>
      <h1>Which cat are you?</h1>
      <div className="homePageButtonContainer">
        <Button
          sx={{
            fontSize: '1rem',
            padding: '10px 20px',
            border: '1px solid #ccc',
            borderRadius: '1rem',
            backgroundColor: '#f0f0f0',
            color: 'black',
            transition: 'background-color 0.3s, transform 0.3s',
            '&:hover': {
              backgroundColor: '#e0e0e0',
              transform: 'scale(1.15)',
              color: 'black'
            }
          }}
          onClick={handleStudentClick}>
          Student Cat
        </Button>
        <Button
          sx={{
            fontSize: '1rem',
            padding: '10px 20px',
            border: '1px solid #ccc',
            borderRadius: '1rem',
            backgroundColor: '#f0f0f0',
            color: 'black',
            cursor: 'pointer',
            transition: 'background-color 0.3s, transform 0.3s',
            '&:hover': {
              backgroundColor: '#e0e0e0',
              transform: 'scale(1.15)',
              color: 'black'
            }
          }}
          onClick={handleTeacherClick}>
          Teacher Cat
        </Button>
      </div>
    </div>
  );
}