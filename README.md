# CAT Comprehension
Aaron Chan, Sam Zhao, Timothy Fang, Linna Zhang, Gloria Fung

## Description
CAT Comprehension is a web application that allows students to enhance their code comprehension skills through AI-driven activity.
The application allows students to write a summary of a block of code from our database, which is marked from our test cases and generates a score for the user.
Features such as **Progression and Performance Tracking** and **Educator Tools and Analytics** are supported to benefit both students and teachers.

## Docker Compose
1. Install Docker Desktop
2. Navigate to the root folder of our application.
3. Build the containers using:
    ```sh
    docker compose build
    ```
3. Start the containers using:
    ```sh
    docker compose up
    ```
4. Frontend is accessible at `http://localhost:3000`
5. Backend is accessible at `http://localhost:8080`
6. Ollama is accessible at `http://localhost:11434`

## Testing
1. Unit test report is located at [index.html](./backend/mochawesome-report/index.html)
2. To run tests using command line and regenerate report and automatically open html report:
    ```sh
    cd backend && npm i && npm test
    ```
Note: We clarified with TA Yinan Ye that we can have a command line input to generate index.html file
