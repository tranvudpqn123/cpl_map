import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, distinctUntilChanged, filter, map, of, shareReplay} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {IResponseData} from '@models/response-data.interface';
import {UtilsService} from '@services/utils.service';
import data from './merchant.data.json';

@Injectable({
    providedIn: 'root'
})
export class MerchantFilterService {
    private readonly httpClient = inject(HttpClient);
    private readonly utilsService = inject(UtilsService);
    private readonly addressData = new BehaviorSubject<{
        addressGroups: IAddressGroupData[],
        selectedAddress: IAddress | null,
        selectedAddressGroupId: string,
        isShowListAddressGroups: boolean,

        selectedMerchant: IMerchant | null,
        merchantGroups: IAddressGroupData[],
        isShowMerchantGroups: boolean,


    }>(
        {
            addressGroups: [],
            selectedAddress: null,
            selectedAddressGroupId: 'ALL',
            isShowListAddressGroups: false,
            isShowMerchantGroups: false,
            selectedMerchant: null,
            merchantGroups: [],
        }
    );

    get addressData$() {
        return this.addressData.asObservable();
    }
    get selectedAddressGroup$() {
        return this.addressData.asObservable().pipe(
            distinctUntilChanged((prev, curr) => {
                return prev === curr;
            }),
            map(data => {
                const {addressGroups, selectedAddressGroupId} = data;
                return addressGroups.find(it => it.id === selectedAddressGroupId) ?? null;
            }));
    }
    get addresses$() {
        return this.addressData.asObservable().pipe(
            distinctUntilChanged((prev, curr) => {
                return prev === curr;
            }),
            map(data => {
                const {addressGroups, selectedAddressGroupId} = data;
                if (selectedAddressGroupId === 'ALL') {
                    return addressGroups.flatMap(it => it.addresses);
                }

                const selectedAddressGroup = addressGroups.find(it => it.id === selectedAddressGroupId)
                return selectedAddressGroup ? selectedAddressGroup.addresses : [];
            }));
    }
    get allAddresses$() {
        return this.addressData.asObservable().pipe(
            distinctUntilChanged((prev, curr) => {
                return prev === curr;
            }),
            map(data => {
                const {addressGroups, selectedAddressGroupId} = data;
                return addressGroups.flatMap(it => it.addresses);
            }));
    }
    get isShowListAddressGroups$() {
        return this.addressData.asObservable().pipe(
            distinctUntilChanged((prev, curr) => {
                return prev === curr;
            }),
            map(data => {
                return data.isShowListAddressGroups;
            }));
    }
    get isShowMerchantGroups$() {
        return this.addressData.asObservable().pipe(
            distinctUntilChanged((prev, curr) => {
                return prev.isShowMerchantGroups === curr.isShowMerchantGroups;
            }),
            map(data => {
                return data.isShowMerchantGroups;
            }));
    }
    get selectedAddress$() {
        return this.addressData.asObservable().pipe(
            map(data => data.selectedAddress),
            distinctUntilChanged((prev, curr) => {
                return prev === curr;
            }),
            map(data => data));
    }
    get selectedMerchant$() {
        return this.addressData.asObservable().pipe(
            map(data => data.selectedMerchant),
            distinctUntilChanged((prev, curr) => {
                return prev === curr;
            }),
            map(data => data));
    }
    get addressGroups$() {
        return this.addressData.asObservable().pipe(
            map(data => data.addressGroups),
            distinctUntilChanged((prev, curr) => {
                return prev === curr;
            }),
            map(data => {
                return data.map(it => {
                    const avatars = it.addresses.slice(it.addresses.length - 2).map(address => address.avatar);

                    return {
                        id: it.id,
                        title: it.title,
                        avatars,
                        numberAddresses: it.addresses.length
                    }
                }) as IAddressGroup[];
            }), shareReplay(1));
    }
    get merchantGroups$() {
        return this.addressData.asObservable().pipe(
            map(data => data.merchantGroups),
            distinctUntilChanged((prev, curr) => {
                return prev === curr;
            }),
            map(data => {
                return data.map(it => {
                    const avatars = it.addresses.slice(it.addresses.length - 2).map(address => address.avatar);

                    return {
                        id: it.id,
                        title: it.title,
                        avatars,
                        numberAddresses: it.addresses.length
                    }
                }) as IAddressGroup[];
            }), shareReplay(1));
    }
    get selectedAddressGroupId$() {
        return this.addressData.asObservable().pipe(
            distinctUntilChanged(),
            map(data => data.selectedAddressGroupId));
    }
    updateAddressGroups(addressGroups: IAddressGroupData[]): void {
        this.addressData.next({...this.addressData.value, addressGroups});
    }

    updateSelectedAddressGroup(addressGroupId: string) {
        const {addressGroups, selectedAddressGroupId} = this.addressData.value;
        if (
            addressGroupId === 'ALL' ||
            (selectedAddressGroupId !== addressGroupId && addressGroups.find(it => it.id === addressGroupId))
        ) {
            this.addressData.next({
                ...this.addressData.value,
                selectedAddressGroupId: addressGroupId,
            });
        }
    }
    updateSelectedMerchant(merchant: IMerchant | null) {
        this.addressData.next({...this.addressData.value, selectedMerchant: merchant});
    }

    getMerchants(merchantFilterRequest: IMerchantFilterRequest) {
        const url = `https://apigw.cashplus.vn/api/app/customer/home/listPartnerV2?page_size=10`;
        // return of(this.utilsService.convertKeysToCamelCase<IResponseData<IMerchantResponse>>(data));
        return this.httpClient.post<IResponseData<IMerchantResponse>>(url, merchantFilterRequest)
            .pipe(map(res => this.utilsService.convertKeysToCamelCase<IResponseData<IMerchantResponse>>(res)));
    }
}

export interface IMerchantFilterRequest {
    search: string;
}

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
    serviceTypeId: string
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
