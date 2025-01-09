import {Injectable} from '@angular/core';
import {BehaviorSubject, distinctUntilChanged, filter, map, shareReplay} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MerchantFilterService {

    private readonly addressData = new BehaviorSubject<{
        addressGroups: IAddressGroupData[],
        selectedAddress: IAddress,
        selectedAddressGroupId: string,
    }>(
        {
            addressGroups: [
                {
                    id: '1',
                    title: 'Hà Nội',
                    addresses: [
                        {
                            id: '1',
                            title: 'Hotel Mely',
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
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/472445WTa/mat-tien-b0010979.jpg'
                                    ]
                                },
                                {
                                    id: '3',
                                    title: 'Videos',
                                    images: [
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/472445WTa/mat-tien-b0010979.jpg'
                                    ]
                                },
                                {
                                    id: '4',
                                    title: 'By Owner',
                                    images: [
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/472445WTa/mat-tien-b0010979.jpg'
                                    ]
                                },
                                {
                                    id: '5',
                                    title: 'Rooms',
                                    images: [
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/472445WTa/mat-tien-b0010979.jpg'
                                    ]
                                },
                                {
                                    id: '6',
                                    title: 'Exteriors',
                                    images: [
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/472445WTa/mat-tien-b0010979.jpg'
                                    ]
                                },
                                {
                                    id: '7',
                                    title: 'Food & Drink',
                                    images: [
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/472445WTa/mat-tien-b0010979.jpg'
                                    ]
                                },
                                {
                                    id: '8',
                                    title: 'Beach',
                                    images: [
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/472445WTa/mat-tien-b0010979.jpg'
                                    ]
                                },
                                {
                                    id: '9',
                                    title: 'From Visitors',
                                    images: [
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/472445WTa/mat-tien-b0010979.jpg'
                                    ]
                                }
                            ]
                        },
                        {
                            id: '1',
                            title: 'Hotel Mely',
                            avatar: 'https://gcs.tripi.vn/tripi-assets/mytour/icons/image_homestay_chung_cu.png',
                            ratingNumber: 3.5,
                            ratingAmount: 335,
                            imageGroups: [
                                {
                                    id: '1',
                                    title: 'All',
                                    images: [
                                        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/472445WTa/mat-tien-b0010979.jpg'
                                    ]
                                }
                            ]
                        },
                        {
                            id: '2',
                            title: 'MerPerle Dalat Hotel',
                            avatar: 'https://gcs.tripi.vn/tripi-assets/mytour/icons/image_homestay_homestay.png',
                            ratingNumber: 4.4,
                            ratingAmount: 335,
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
                            id: '3',
                            title: 'MerPerle Dalat Hotel',
                            avatar: 'https://gcs.tripi.vn/tripi-assets/mytour/icons/image_homestay_bungalow.png',
                            ratingNumber: 4,
                            ratingAmount: 335,
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
                {
                    id: '2',
                    title: 'Hà Nội',
                    addresses: [
                        {
                            id: '1',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '2',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '3',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '4',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '5',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '6',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '7',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '8',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '9',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '10',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '11',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '12',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '13',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '14',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '15',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        }
                    ]
                },
                {
                    id: '3',
                    title: 'Bà Rịa Vũng Tàu',
                    addresses: [
                        {
                            id: '1',
                            title: 'Hotel Mely',
                            avatar: 'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/471582xtF/img21.jpg',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        }
                    ]
                },
                {
                    id: '4',
                    title: 'Hà Nội',
                    addresses: [
                        {
                            id: '1',
                            title: 'Hotel Mely',
                            avatar: 'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/472445WTa/mat-tien-b0010979.jpg',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '1',
                            title: 'Hotel Mely',
                            avatar: 'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/472445WTa/mat-tien-b0010979.jpg',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '2',
                            title: 'MerPerle Dalat Hotel',
                            avatar: 'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/472445BDn/mat-tien-4w9a8084.jpg',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '3',
                            title: 'MerPerle Dalat Hotel',
                            avatar: 'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/471583VTL/sanh-chinh-10.jpg',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },

                    ]
                },
                {
                    id: '5',
                    title: 'Hà Nội',
                    addresses: [
                        {
                            id: '1',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '2',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '3',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '4',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '5',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '6',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '7',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '8',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '9',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '10',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '11',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '12',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '13',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '14',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '15',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        }
                    ]
                },
                {
                    id: '6',
                    title: 'Bà Rịa Vũng Tàu',
                    addresses: [
                        {
                            id: '1',
                            title: 'Hotel Mely',
                            avatar: 'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/471582xtF/img21.jpg',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        }
                    ]
                },
                {
                    id: '7',
                    title: 'Hà Nội',
                    addresses: [
                        {
                            id: '1',
                            title: 'Hotel Mely',
                            avatar: 'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/472445WTa/mat-tien-b0010979.jpg',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '1',
                            title: 'Hotel Mely',
                            avatar: 'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/472445WTa/mat-tien-b0010979.jpg',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '2',
                            title: 'MerPerle Dalat Hotel',
                            avatar: 'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/472445BDn/mat-tien-4w9a8084.jpg',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '3',
                            title: 'MerPerle Dalat Hotel',
                            avatar: 'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/471583VTL/sanh-chinh-10.jpg',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },

                    ]
                },
                {
                    id: '8',
                    title: 'Hà Nội',
                    addresses: [
                        {
                            id: '1',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '2',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '3',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '4',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '5',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '6',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '7',
                            title: 'Hotel Mely',
                            avatar: 'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://assets.tripi.vn/assets/show/review/img/476052ZDIMwHSx/image.jpg',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '8',
                            title: 'Hotel Mely',
                            avatar: 'https://gcs.tripi.vn/hms_prod/photo/img/471582RhU/img1206.jpg',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '9',
                            title: 'Hotel Mely',
                            avatar: 'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://assets.tripi.vn/assets/show/review/img/476346LsvcWIZv/image.jpg',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '10',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '11',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '12',
                            title: 'Hotel Mely',
                            avatar: 'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://assets.tripi.vn/assets/show/review/img/480315pBxlyAfa/image.jpg',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '13',
                            title: 'Hotel Mely',
                            avatar: 'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://assets.tripi.vn/assets/show/review/img/482151oRTttayX/image.jpg',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '14',
                            title: 'Hotel Mely',
                            avatar: 'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/472445OTu/ho-boi-4w9a8003.jpg',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        },
                        {
                            id: '15',
                            title: 'Hotel Mely',
                            avatar: 'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/472445xgZ/ho-boi-4w9a8014.jpg',
                            ratingNumber: 4,
                            ratingAmount: 335, imageGroups:[]
                        }
                    ]
                },
            ],
            selectedAddress: {
                id: '1',
                title: 'Hotel Mely',
                avatar: 'https://gcs.tripi.vn/tripi-assets/mytour/icons/image_homestay_biet_thu.png',
                ratingNumber: 4.6,
                ratingAmount: 33335,
                imageGroups: [
                    {
                        id: '1',
                        title: 'All',
                        images: [
                            'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/472445WTa/mat-tien-b0010979.jpg',

                        ]
                    },
                    {
                        id: '2',
                        title: 'Latest',
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
                        id: '3',
                        title: 'Videos',
                        images: [
                            'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/472445WTa/mat-tien-b0010979.jpg'
                        ]
                    },
                    {
                        id: '4',
                        title: 'By Owner',
                        images: [
                            'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/472445WTa/mat-tien-b0010979.jpg'
                        ]
                    },
                    {
                        id: '5',
                        title: 'Rooms',
                        images: [
                            'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/472445WTa/mat-tien-b0010979.jpg'
                        ]
                    },
                    {
                        id: '6',
                        title: 'Exteriors',
                        images: [
                            'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/472445WTa/mat-tien-b0010979.jpg'
                        ]
                    },
                    {
                        id: '7',
                        title: 'Food & Drink',
                        images: [
                            'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/472445WTa/mat-tien-b0010979.jpg'
                        ]
                    },
                    {
                        id: '8',
                        title: 'Beach',
                        images: [
                            'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/472445WTa/mat-tien-b0010979.jpg'
                        ]
                    },
                    {
                        id: '9',
                        title: 'From Visitors',
                        images: [
                            'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/472445WTa/mat-tien-b0010979.jpg'
                        ]
                    }
                ]
            },
            selectedAddressGroupId: 'ALL'
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
    get selectedAddress$() {
        return this.addressData.asObservable().pipe(
            map(data => data.selectedAddress),
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
}

export interface IAddressImageGroup {
    id: string,
    title: string;
    images: string[];
}
