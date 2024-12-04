export interface IMerchantRequest {
    keySearch: string;
    serviceTypeId: string;
    sortBy: 'BILL_AMOUNT' | 'BILL_COUNT';
    pageSize: number;
    latitude?: number;
    longtitude?: number;
    productGroupId?: string;
    districtId?: string;
    provinceId?: string;
    wardId?: string;
}

export interface IMerchant {
    id: string;
    branch_id: any;
    score: number;
    distance: number;
    is_branch: boolean;
    partner_id: string;
    service_type_id: string;
    code: string;
    name: string;
    avatar: string;
    start_hour: string;
    end_hour: string;
    service_type_icons: string;
    rating: number;
    total_rating: number;
    discount_rate: number;
    avatar_small: any;
    description: string;
    address: string;
    phone: string;
    link_QR: string;
    full_address: string;
    status: number;
    is_favourite: boolean;
    latitude: number;
    longtitude: number;
    contract_discount_rate: number;
    working_times: IWorkingTime[];
    total_bill_in_month: any;
    total_bill_amount_in_month: any;
    total_bill: any;
    total_bill_amount: any;
    selected: boolean;
}

export interface IWorkingTime {
    id: number;
    partner_id: string;
    start_hour: string;
    end_hour: string;
    date_created: string;
    date_updated: string;
}

