
export interface IMerchantFilterRequest {
    search: string;
    subServiceTypeId: string;
}


export interface IMerchantResponse {
    totalElements: number
    zoom: number
    maxDistanceAll: number
    maxDistance: number
    data: IMerchant[]
    haveData: boolean
    totalElementsInBound: number
    totalPage: number
    totalDocumentsInIndex: number
}


export interface IMerchant {
    id: string
    branchId: any
    score: number
    distance: number
    isBranch: boolean
    partnerId: string
    serviceTypeId: string;
    serviceName: string;
    code: string
    name: string
    avatar: string
    startHour?: string
    endHour?: string
    serviceTypeIcons: string
    rating: number
    totalRating: number
    discountRate: number
    avatarSmall: string
    description: string
    address: string
    phone: string
    linkQR: string
    fullAddress: string
    status: number
    isFavourite: boolean
    latitude: number
    longtitude: number
    contractDiscount_rate: number
    workingTimes: IWorkingTime[]
    totalBillInMonth: any
    totalBillAmountIn_Month: any
    totalBill: any
    totalBillAmount: any
}



export interface IWorkingTime {
    id: number
    partnerId: string
    startHour: string
    endHour: string
    dateCreated: string
    dateUpdated: string
}
