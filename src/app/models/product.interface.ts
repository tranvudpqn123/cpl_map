
export interface IProductGroup {
    id: string;
    title: string;
    products: IProduct[];
}

export interface IProduct {
    id: string;
    avatar: string;
    title: string;
}
