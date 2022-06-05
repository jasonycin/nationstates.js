export interface IResponse {
    fetchResponse: any,
    unixTime: number,
    statusCode: number,
    statusBool: boolean,
    body: any,
    error?: string,
    js?: any
}
