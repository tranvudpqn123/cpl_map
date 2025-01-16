import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, distinctUntilChanged, map, shareReplay} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {IResponseData} from '@models/response-data.interface';
import {UtilsService} from '@services/utils.service';
import {IconPaths} from '@constants/image-paths';
import {StorageService} from '@services/storage.service';
import {EStorageKey} from '@constants/store-key';

@Injectable({
    providedIn: 'root'
})
export class MerchantFilterService {
    private readonly httpClient = inject(HttpClient);
    private readonly utilsService = inject(UtilsService);
    private readonly storageService = inject(StorageService);
    private readonly addressData = new BehaviorSubject<{
        addressGroups: IAddressGroupData[],
        selectedAddress: IAddress | null,
        selectedAddressGroupId: string,
        isShowListAddressGroups: boolean,

        selectedMerchant: IMerchant | null,
        merchantGroups: IAddressGroupData[],
        isShowMerchantGroups: boolean,
        selectedGroupType: EAddressGroupType | null,
        listAddress: IListAddress[],
        selectedListAddress: IListAddress | null


    }>(
        {
            addressGroups: [],
            selectedAddress: null,
            selectedAddressGroupId: 'ALL',
            isShowListAddressGroups: false,
            isShowMerchantGroups: false,
            selectedMerchant: null,
            merchantGroups: [],
            selectedGroupType: null,
            listAddress: [],
            selectedListAddress: null,
        }
    );

    constructor() {
        const listAddress = this.storageService.getItem<IListAddress[]>(EStorageKey.LIST_ADDRESS) ?? [
            {
                id: 'TRAVEL_PLANS', icon: IconPaths.TRAVEL_LUGGAGE_LG, title: 'Travel plans', default: true, merchants: []
            },
            {
                id: 'WANT_TO_GO', icon: IconPaths.FLAG_LG, title: 'Want to go', default: true, merchants: []
            },
            {
                id: 'STARRED_PLACES', icon: IconPaths.STAR_LG, title: 'Starred places', default: true, merchants: []
            },
            {
                id: 'FAVORITES', icon: IconPaths.FAVOURITE_LG, title: 'Favourites', default: true, merchants: []
            }
        ];
        this.addressData.next({...this.addressData.value, listAddress});
    }

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
    get listAddress$() {
        return this.addressData.asObservable().pipe(
            map(data => data.listAddress),
            distinctUntilChanged((prev, curr) => {
                return prev === curr;
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
    get selectedGroupType$() {
        return this.addressData.asObservable().pipe(
            map(data => data.selectedGroupType),
            distinctUntilChanged((prev, curr) => {
                return prev === curr;
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
            map(data => data.selectedAddressGroupId),
            distinctUntilChanged((prev, curr) => prev === curr));
    }
    get selectedListAddress$() {
        return this.addressData.asObservable().pipe(
            map(data => data.selectedListAddress),
            distinctUntilChanged((prev, curr) => {
                return prev === curr;
            }));
    }

    updateAddressGroups(addressGroups: IAddressGroupData[]): void {
        this.addressData.next({...this.addressData.value, addressGroups});
    }

    updateSelectedAddressGroup(addressGroupId: string) {
        this.addressData.next({
            ...this.addressData.value,
            selectedAddressGroupId: addressGroupId,
        });
    }

    updateSelectedGroupType(selectedGroupType: EAddressGroupType | null) {
        this.addressData.next({
            ...this.addressData.value,
            selectedMerchant: null,
            selectedGroupType: selectedGroupType,
        });
    }
    updateSelectedMerchant(merchant: IMerchant | null) {
        this.addressData.next({...this.addressData.value, selectedMerchant: merchant});
    }

    createOrUpdateListAddress(newListAddress: IListAddress) {
        const {listAddress} = this.addressData.value;

        if (newListAddress.id) {
            const currentIndex = listAddress.findIndex(it => it.id === newListAddress.id);
            if (currentIndex === -1) {
                return;
            }
            listAddress[currentIndex] = newListAddress;
        } else {
            newListAddress.id = this.utilsService.generateGUID();
            listAddress.push(newListAddress);
        }

        this.addressData.next({
            ...this.addressData.value,
            listAddress: [...listAddress],
        });
        this.storageService.setItem(JSON.stringify(listAddress), EStorageKey.LIST_ADDRESS);
    }

    removeListAddress(listAddressId: string) {
        let {listAddress} = this.addressData.value;

        const currentIndex = listAddress.findIndex(it => it.id === listAddressId);
        if (currentIndex === -1) {
            return;
        }
        listAddress.splice(currentIndex, 1);

        this.addressData.next({
            ...this.addressData.value,
            listAddress: [...listAddress],
        });
        this.storageService.setItem(JSON.stringify(listAddress), EStorageKey.LIST_ADDRESS);
    }

    addToList(listAddressId: string, merchant: IMerchant) {
        let {listAddress} = this.addressData.value;

        const currentIndex = listAddress.findIndex(it => it.id === listAddressId);
        if (currentIndex === -1) {
            return;
        }

        const isExist = listAddress[currentIndex].merchants.find(it => it.id === merchant.id);
        if (isExist) {
            return;
        }

        listAddress.forEach(group => {
            if (group.id !== 'FAVORITES' && group.id !== listAddressId) {
                const index = group.merchants.findIndex(it => it.id === merchant.id);
                if (index !== -1) {
                    group.merchants.splice(index, 1);
                }
            }
        })

        listAddress[currentIndex].merchants.push(merchant);

        this.addressData.next({
            ...this.addressData.value,
            listAddress: [...listAddress],
        });
        this.storageService.setItem(JSON.stringify(listAddress), EStorageKey.LIST_ADDRESS);
    }

    removeFromList(listAddressId: string, merchantId: string) {
        let {listAddress} = this.addressData.value;

        const currentListIndex = listAddress.findIndex(it => it.id === listAddressId);
        if (currentListIndex === -1) {
            return;
        }

        const merchantIndex = listAddress[currentListIndex].merchants.findIndex(it => it.id === merchantId);
        if (merchantIndex !== -1) {
            listAddress[currentListIndex].merchants.splice(merchantIndex, 1);
            this.addressData.next({
                ...this.addressData.value,
                listAddress: [...listAddress],
            });
            this.storageService.setItem(JSON.stringify(listAddress), EStorageKey.LIST_ADDRESS);

        }
    }

    selectListAddress(listAddressId: string) {
        const {listAddress} = this.addressData.value;
        let selectedListAddress = listAddress.find(it => it.id === listAddressId) ?? null;
        selectedListAddress = selectedListAddress ? {...selectedListAddress} : null;
        this.addressData.next({
            ...this.addressData.value,
            selectedGroupType: EAddressGroupType.RECENT,
            selectedListAddress
        });
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

export enum EAddressGroupType {
    'ALL' = 'ALL',
    'SAVED' = 'SAVED',
    'RECENT' = 'RECENT',
}

export interface IListAddress {
    id: string;
    icon: string;
    title: string;
    default: boolean;
    merchants: IMerchant[];
}
