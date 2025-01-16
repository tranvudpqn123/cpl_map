
export interface IProductGroup {
    id: string,
    productGroupName: string,
    productGroupAvatr: string,
    partnerId: string
}

export interface IProduct {
    avatar : string
    avatarSmall: string
    description: string
    discountRate: number
    id: string
    listImages: []
    number: number
    partnerId: string
    price: number
    productGroupId: string
    productName: string
    quantity: number
    statusChange: boolean
}
