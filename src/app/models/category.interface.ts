// export interface ICategory {
//     id: string;
//     service_type_id: string;
//     code: string;
//     name: string;
//     avatar: string;
//     description: string;
//     status: number;
//     user_created: string;
//     user_updated: string;
//     date_created: string;
//     date_updated: string;
// }

export interface ICategory {
    code: string
    discount_rate: number
    icons: string
    icons_in_map: string
    id: string
    name: string
    orders: number;
    serviceTypeTags: []

}
