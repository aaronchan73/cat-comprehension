export interface IResult {
  success: boolean;
  message: string;
  attemptId: string;
  questionId: number;
  generateCode: string;
  numPassed: number;
  username: string;
}