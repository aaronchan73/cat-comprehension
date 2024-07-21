export interface IResult {
  success: boolean;
  message: string;
  attemptId: string;
  questionId: string;
  generateCode: string;
  numPassed: number;
  username: string;
}