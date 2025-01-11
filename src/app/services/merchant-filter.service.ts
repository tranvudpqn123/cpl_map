import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, distinctUntilChanged, filter, map, shareReplay} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {IResponseData} from '@models/response-data.interface';
import {UtilsService} from '@services/utils.service';

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
            addressGroups: [
                {
                    id: '1',
                    title: 'Hà Nội',
                    addresses: [
                        {
                            id: '029871e7-0ca9-4a62-934b-96ddcf1821f7',
                            title: '1995 Coffee',
                            avatar: 'https://gcs.tripi.vn/tripi-assets/mytour/icons/image_homestay_biet_thu.png',
                            ratingNumber: 4.6,
                            ratingAmount: 33335,
                            imageGroups: [
                                {
                                    id: '1',
                                    title: 'All',
                                    images: [
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/472445WTa/mat-tien-b0010979.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455210yCJcAm/cmv-welcom-center_interior-12.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455210EfqeBv/cmv-welcome-center_exterior_10.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455210mtrWxM/cmv-pool-33.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455210UGLXZg/cmv-pool-29.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211TgJMHE/faro-tower-1.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211UzwjzQ/cmv-mundo-restaurant-4.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211JeyMiR/cmv-mundo-restaurant-6.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211Xktjjr/cmv-mundo-restaurant-7.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211MbnTyc/cmv-mundo-restaurant-2.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211vPzGaB/cmv-el-salon-bar-2.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211MwbqAv/cmv-el-salon-bar-3.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211myYXiA/cmv-el-salon-bar-4.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211TVYCWA/cmv-el-salon-bar-6.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211xHNkrZ/cmv-el-salon-bar-5.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211zujUUh/cmv-kid-playground-5.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211MnbdTM/cmv-kid-playground-4.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211AtUwtE/cmv-kid-playground-9.jpg'
                                    ]
                                },
                                {
                                    id: '2',
                                    title: 'Latest',
                                    images: [
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/472445WTa/mat-tien-b0010979.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/472445WTa/mat-tien-b0010979.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455210yCJcAm/cmv-welcom-center_interior-12.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455210EfqeBv/cmv-welcome-center_exterior_10.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455210mtrWxM/cmv-pool-33.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455210UGLXZg/cmv-pool-29.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211TgJMHE/faro-tower-1.jpg',
                                    ]
                                },
                                {
                                    id: '3',
                                    title: 'Videos',
                                    images: [
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/472445WTa/mat-tien-b0010979.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211TVYCWA/cmv-el-salon-bar-6.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211xHNkrZ/cmv-el-salon-bar-5.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211zujUUh/cmv-kid-playground-5.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211MnbdTM/cmv-kid-playground-4.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211AtUwtE/cmv-kid-playground-9.jpg'
                                    ]
                                },
                                {
                                    id: '4',
                                    title: 'By Owner',
                                    images: [
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/472445WTa/mat-tien-b0010979.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211vPzGaB/cmv-el-salon-bar-2.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211MwbqAv/cmv-el-salon-bar-3.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211myYXiA/cmv-el-salon-bar-4.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211TVYCWA/cmv-el-salon-bar-6.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211xHNkrZ/cmv-el-salon-bar-5.jpg',
                                    ]
                                },
                                {
                                    id: '5',
                                    title: 'Rooms',
                                    images: [
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/472445WTa/mat-tien-b0010979.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211vPzGaB/cmv-el-salon-bar-2.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211MwbqAv/cmv-el-salon-bar-3.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211myYXiA/cmv-el-salon-bar-4.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211TVYCWA/cmv-el-salon-bar-6.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211xHNkrZ/cmv-el-salon-bar-5.jpg',
                                    ]
                                },
                                {
                                    id: '6',
                                    title: 'Exteriors',
                                    images: [
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/472445WTa/mat-tien-b0010979.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211vPzGaB/cmv-el-salon-bar-2.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211MwbqAv/cmv-el-salon-bar-3.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211myYXiA/cmv-el-salon-bar-4.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211TVYCWA/cmv-el-salon-bar-6.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211xHNkrZ/cmv-el-salon-bar-5.jpg',
                                    ]
                                },
                                {
                                    id: '7',
                                    title: 'Food & Drink',
                                    images: [
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/472445WTa/mat-tien-b0010979.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211vPzGaB/cmv-el-salon-bar-2.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211MwbqAv/cmv-el-salon-bar-3.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211myYXiA/cmv-el-salon-bar-4.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211TVYCWA/cmv-el-salon-bar-6.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211xHNkrZ/cmv-el-salon-bar-5.jpg',
                                    ]
                                },
                                {
                                    id: '8',
                                    title: 'Beach',
                                    images: [
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/472445WTa/mat-tien-b0010979.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211vPzGaB/cmv-el-salon-bar-2.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211MwbqAv/cmv-el-salon-bar-3.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211myYXiA/cmv-el-salon-bar-4.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211TVYCWA/cmv-el-salon-bar-6.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211xHNkrZ/cmv-el-salon-bar-5.jpg',
                                    ]
                                },
                                {
                                    id: '9',
                                    title: 'From Visitors',
                                    images: [
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/472445WTa/mat-tien-b0010979.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211vPzGaB/cmv-el-salon-bar-2.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211MwbqAv/cmv-el-salon-bar-3.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211myYXiA/cmv-el-salon-bar-4.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211TVYCWA/cmv-el-salon-bar-6.jpg',
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211xHNkrZ/cmv-el-salon-bar-5.jpg',
                                    ]
                                }
                            ],
                            addressDetail: '',
                        },
                        {
                            id: '167d7bcc-472e-4394-b570-ea188d06f890',
                            title: 'Gila Coffee',
                            avatar: 'https://gcs.tripi.vn/tripi-assets/mytour/icons/image_homestay_homestay.png',
                            ratingNumber: 4.4,
                            ratingAmount: 335,
                            addressDetail: '153 Giáp Nhất, Phường Thượng Đình',
                            imageGroups: [
                                {
                                    id: '1',
                                    title: 'All',
                                    images: [
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/472445BDn/mat-tien-4w9a8084.jpg'
                                    ]
                                }
                            ]
                        },
                        {
                            id: 'e2e7a7f1-0989-424d-a19c-38a86242863b',
                            title: '1945 Coffee',
                            avatar: 'https://gcs.tripi.vn/tripi-assets/mytour/icons/image_homestay_bungalow.png',
                            ratingNumber: 4,
                            ratingAmount: 335,
                            addressDetail: '43 Nguyễn Thị Định, Phường Trung Hòa',
                            imageGroups: [
                                {
                                    id: '1',
                                    title: 'All',
                                    images: [
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/471583VTL/sanh-chinh-10.jpg'
                                    ]
                                }
                            ]
                        },

                    ]
                },
            ],
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
