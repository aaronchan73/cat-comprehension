import { IResult } from "./IResult"

export interface IGetAttemptByUsername {
    message: string,
    userAttempts: IResult[]
}