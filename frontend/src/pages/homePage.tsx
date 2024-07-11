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
        <button className="homePageButton" onClick={handleStudentClick}>
          Student Cat
        </button>
        <button className="homePageButton" onClick={handleTeacherClick}>
          Teacher Cat
        </button>
      </div>
    </div>
  );
}