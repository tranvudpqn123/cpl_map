export interface IResponseData<T> {
    code: string;
    message: string;
    data: T;
}



export interface IData {
    data: [
        page_no: number,
        page_size: number,
        total_elements: number,
        total_page: number,
        data: [],
    ];
}
