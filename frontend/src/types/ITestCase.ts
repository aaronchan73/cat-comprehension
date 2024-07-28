export interface ITestCase{
    test: string,
    input: string,
    expectedOutput: string,
    actualOutput: string,
    message: string,
    passed: boolean
}
