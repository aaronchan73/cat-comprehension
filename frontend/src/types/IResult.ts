export interface IResult {
    success: boolean;
    message: string;
    attemptId: string;
    generateCode: string;
    numPassed: number;
    username: string;
}