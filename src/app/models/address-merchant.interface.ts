

export interface IAddressGroup {
    id: string;
    title: string;
    avatars: string[];
    numberAddresses: number;
}

export interface IAddressGroupData {
    id: string;
    title: string;
    addresses: IAddress[];
}

export interface IAddress {
    id: string;
    title: string;
    avatar: string;
    ratingNumber: number;
    ratingAmount: number;
    imageGroups: IAddressImageGroup[];
    addressDetail: string;
}

export interface IAddressImageGroup {
    id: string,
    title: string;
    images: string[];
}



export enum EAddressDetailTab {
    'OVERVIEW' = 'OVERVIEW',
    'REVIEW' = 'REVIEW',
    'ABOUT' = 'ABOUT',
    'PRODUCT' = 'PRODUCT'
}
