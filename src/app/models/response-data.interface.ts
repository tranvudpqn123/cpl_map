export interface IResponseData<T> {
    code: string;
    message: string;
    data: T;
}
