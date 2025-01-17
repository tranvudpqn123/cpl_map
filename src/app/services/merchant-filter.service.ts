import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, distinctUntilChanged, map, shareReplay} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {IResponseData} from '@models/response-data.interface';
import {UtilsService} from '@services/utils.service';
import {IconPaths} from '@constants/image-paths';
import {StorageService} from '@services/storage.service';
import {EStorageKey} from '@constants/store-key';
import data from './merchant.data.json';
import {environment} from '@environments/environment';
import {IMerchant, IMerchantFilterRequest, IMerchantResponse} from '@models/merchant.interface';
import {IAddress, IAddressGroup, IAddressGroupData} from '@models/address-merchant.interface';

@Injectable({
    providedIn: 'root'
})
export class MerchantFilterService {
    private readonly TOKEN = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjAzNzc2NzA1MDkiLCJuYW1laWQiOiJjdXN0b21lciIsImZhbWlseV9uYW1lIjoiMmE2MDM3OGUtZDEyMy00YjA1LThmYzAtNjU5ZDM5YTJmNWU5IiwibmJmIjoxNzM2ODQyMTU4LCJleHAiOjE3MzgwNTE3NTgsImlhdCI6MTczNjg0MjE1OH0.nplOmu-WL8i_tzB5cDj0dkaSY5PgwzZmmq1zPmgJMLc`
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
        selectedListAddress: IListAddress | null,
        selectedSubService: ISubServiceType | null,

        // Custom Data
        merchantGroups_v2: IMerchantGroup[],

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
            selectedSubService: null,




            // Custom Data
            merchantGroups_v2: [],
        }
    );

    serviceTypes$ = new BehaviorSubject<IServiceType[]>([]);

    constructor() {


        const systemGroupMerchants: IMerchantGroup[] = this.storageService.getItem<IMerchantGroup[]>(EStorageKey.GROUP_MERCHANTS) ?? [
            {
                id: ESystemMerchantGroupType.TRAVEL_PLANS,
                icon: IconPaths.TRAVEL_LUGGAGE_LG,
                title: 'Travel plans',
                merchants: [],
                avatars: [],
                type: EMerchantGroupType.SYSTEM,
                showOnSidebar: true,
            },
            {
                id: ESystemMerchantGroupType.WANT_TO_GO,
                icon: IconPaths.FLAG_LG,
                title: 'Want to go',
                merchants: [],
                avatars: [],
                type: EMerchantGroupType.SYSTEM,
                showOnSidebar: true,
            },
            {
                id: ESystemMerchantGroupType.STARRED_PLACES,
                icon: IconPaths.STAR_LG,
                title: 'Starred places',
                merchants: [],
                avatars: [],
                type: EMerchantGroupType.SYSTEM,
                showOnSidebar: true,
            },
            {
                id: ESystemMerchantGroupType.FAVORITES,
                icon: IconPaths.FAVOURITE_LG,
                title: 'Favourites',
                merchants: [],
                avatars: [],
                type: EMerchantGroupType.SYSTEM,
                showOnSidebar: true,
            }
        ];
        this.addressData.next({
            ...this.addressData.value,
            merchantGroups_v2: [...systemGroupMerchants]
        });

        this.getServiceTypes().subscribe(res => {
            const {code, data} = res;
            if (code === '200' && data) {
                this.serviceTypes$.next(data);
            }
        });
    }
    private  readonly  API_URL = environment.apiUrl;

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
            })
        );
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
    get selectedSubService$() {
        return this.addressData.asObservable().pipe(
            map(data => data.selectedSubService),
            distinctUntilChanged((prev, curr) => {
                return prev === curr;
            }));
    }

    get merchantGroups_v2$() {
        return this.addressData.asObservable().pipe(
            map(data => data.merchantGroups_v2),
            distinctUntilChanged((prev, curr) => {
                return prev === curr;
            }));
    }

    updateSelectedSubService(subService: ISubServiceType | null) {
        this.addressData.next({...this.addressData.value, selectedSubService: subService});
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
            selectedGroupType: selectedGroupType,
        });
    }
    updateSelectedMerchant(merchant: IMerchant | null) {
        this.addressData.next({...this.addressData.value, selectedMerchant: merchant});
    }

    createOrUpdateMerchantGroup(newListAddress: IMerchantGroup) {
        const {merchantGroups_v2} = this.addressData.value;

        if (newListAddress.id) {
            const currentIndex = merchantGroups_v2.findIndex(it => it.id === newListAddress.id);
            if (currentIndex === -1) {
                return;
            }
            merchantGroups_v2[currentIndex] = newListAddress;
        } else {
            newListAddress.id = this.utilsService.generateGUID();
            merchantGroups_v2.push(newListAddress);
        }

        console.log('merchantGroups_v2', merchantGroups_v2);
        this.addressData.next({
            ...this.addressData.value,
            merchantGroups_v2: [...merchantGroups_v2],
        });
        this.storageService.setItem(JSON.stringify(merchantGroups_v2), EStorageKey.GROUP_MERCHANTS);
    }

    removeMerchantGroup(groupId: string) {
        let {merchantGroups_v2} = this.addressData.value;

        const currentIndex = merchantGroups_v2.findIndex(it => it.id === groupId);
        if (currentIndex === -1) {
            return;
        }
        merchantGroups_v2.splice(currentIndex, 1);

        this.addressData.next({
            ...this.addressData.value,
            merchantGroups_v2: [...merchantGroups_v2],
        });
        this.storageService.setItem(JSON.stringify(merchantGroups_v2), EStorageKey.GROUP_MERCHANTS);
    }

    addToList(groupId: string, merchant: IMerchant) {
        let {merchantGroups_v2} = this.addressData.value;

        const currentIndex = merchantGroups_v2.findIndex(it => it.id === groupId);
        if (currentIndex === -1) {
            // Create new group
            merchantGroups_v2.push({
                id: groupId,
                title: merchant.serviceName,
                icon: '',
                avatars: [merchant.avatar],
                type: EMerchantGroupType.SERVICE_TYPE,
                merchants: [merchant],
                showOnSidebar: true,
            });
        } else {
            const isExist = merchantGroups_v2[currentIndex].merchants.find(it => it.id === merchant.id);
            if (isExist) {
                return;
            }

            merchantGroups_v2.forEach(group => {
                if (group.id !== 'FAVORITES' && group.id !== groupId) {
                    const index = group.merchants.findIndex(it => it.id === merchant.id);
                    if (index !== -1) {
                        group.merchants.splice(index, 1);
                    }
                }
            })

            merchantGroups_v2[currentIndex].merchants.push(merchant);
            const lastTwoAvatars = merchantGroups_v2[currentIndex].merchants.slice(merchantGroups_v2[currentIndex].merchants.length - 2).map(it => it.avatar);
            merchantGroups_v2[currentIndex].avatars = lastTwoAvatars;
        }

        this.addressData.next({
            ...this.addressData.value,
            merchantGroups_v2: [...merchantGroups_v2],
        });
        this.storageService.setItem(JSON.stringify(merchantGroups_v2), EStorageKey.GROUP_MERCHANTS);
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

    removeFromGroup(groupId: string, merchantId: string) {
        let {merchantGroups_v2} = this.addressData.value;

        const currentListIndex = merchantGroups_v2.findIndex(it => it.id === groupId);
        if (currentListIndex === -1) {
            return;
        }

        const merchantIndex = merchantGroups_v2[currentListIndex].merchants.findIndex(it => it.id === merchantId);
        if (merchantIndex !== -1) {
            merchantGroups_v2[currentListIndex].merchants.splice(merchantIndex, 1);
            this.addressData.next({
                ...this.addressData.value,
                merchantGroups_v2: [...merchantGroups_v2],
            });
            this.storageService.setItem(JSON.stringify(merchantGroups_v2), EStorageKey.GROUP_MERCHANTS);

        }
    }

    getMerchants(merchantFilterRequest: IMerchantFilterRequest) {
        const url = this.API_URL + `/app/customer/home/listPartnerV2?page_size=10`;
        const {search, subServiceTypeId} = merchantFilterRequest;

        const requestBody = {
            search,
            sub_service_type_id: subServiceTypeId
        }
        return this.httpClient.post<IResponseData<IMerchantResponse>>(url, requestBody)
            .pipe(map(res => this.utilsService.convertKeysToCamelCase<IResponseData<IMerchantResponse>>(res)));
    }

    getMerchantDetail(data: { partner_id: string; latitude: number; longtitude: number })   {
        const url = this.API_URL + `/app/customer/partner/detail` + `?latitude=${data.latitude}`+`&longtitude=${data.longtitude}` + `&partner_id=${data.partner_id}`;
        // return of(this.utilsService.convertKeysToCamelCase<IResponseData<IMerchantResponse>>(data));
        return this.httpClient.get<IResponseData<string>>(url)
            .pipe(map(res =>
                this.utilsService.convertKeysToCamelCase<IResponseData<IMerchant>>(res)));
    }

    cacheSubServiceTypes(serviceTypeId: string, subServiceTypes: ISubServiceType[]) {
        const serviceTypes = this.serviceTypes$.value;
        const currentIndex = serviceTypes.findIndex(it => it.id === serviceTypeId);
        if (currentIndex === -1) {
            return;
        }
        serviceTypes[currentIndex].subServiceTypes = subServiceTypes;
        this.serviceTypes$.next([...serviceTypes]);
    }


    private getServiceTypes()   {
        const url = this.API_URL + `/app/dropdownapp/servicetype`;
        return this.httpClient.get(url,{
            headers: {
                Authorization: this.TOKEN
            }
        })
            .pipe(map(res =>
                this.utilsService.convertKeysToCamelCase<IResponseData<IServiceType[]>>(res)));
    }

    getSubServiceTypes(serviceTypeId: string)   {
        const url = this.API_URL + `/app/dropdownapp/subservicetype` + `?service_type_id=${serviceTypeId}`;
        return this.httpClient.get<IResponseData<string>>(url,{
            headers: {
                Authorization: this.TOKEN
            }
        })
            .pipe(map(res =>
                this.utilsService.convertKeysToCamelCase<IResponseData<any>>(res)));
    }
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

export interface IServiceType {
    code: string;
    discountRate: number;
    icons: string;
    iconsInMap: string;
    id: string;
    name: string;
    orders: number;
    serviceTypeTags: any[];
    subServiceTypes: ISubServiceType[];
}

export interface ISubServiceType {
    avatar: string;
    id: string;
    name: string;
}

export enum EMerchantGroupType {
    SYSTEM = 'SYSTEM', CUSTOM = 'CUSTOM', SERVICE_TYPE = 'SERVICE_TYPE'
}
export enum ESystemMerchantGroupType {
    TRAVEL_PLANS = 'TRAVEL_PLANS',
    WANT_TO_GO = 'WANT_TO_GO',
    STARRED_PLACES = 'STARRED_PLACES',
    FAVORITES = 'FAVORITES',
}

export interface IMerchantGroup {
    id: string;
    title: string;
    icon: string;
    avatars: string[],
    type: EMerchantGroupType,
    merchants: IMerchant[];
    showOnSidebar: boolean;
}
