import {Injectable} from '@angular/core';
import {BehaviorSubject, map} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MerchantFilterService {

    private readonly addressData = new BehaviorSubject<{
        addressGroups: IAddressGroupData[]
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
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335,
                        },
                        {
                            id: '2',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335,
                        },
                        {
                            id: '3',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335,
                        },
                        {
                            id: '4',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335,
                        },
                        {
                            id: '5',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335,
                        },
                        {
                            id: '6',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335,
                        },
                        {
                            id: '7',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335,
                        },
                        {
                            id: '8',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335,
                        },
                        {
                            id: '9',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335,
                        },
                        {
                            id: '10',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335,
                        },
                        {
                            id: '11',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335,
                        },
                        {
                            id: '12',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335,
                        },
                        {
                            id: '13',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335,
                        },
                        {
                            id: '14',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335,
                        },
                        {
                            id: '15',
                            title: 'Hotel Mely',
                            avatar: 'https://lh5.googleusercontent.com/p/AF1QipMWEt8qZ2qRrrvRh43p8AdcNyN8RAI8nxlC-LX9=w152-h86-k-no',
                            ratingNumber: 4,
                            ratingAmount: 335,
                        }
                    ]
                }
            ]
        }
    );

    get addressData$() {
        return this.addressData.asObservable();
    }

    get addressGroups$() {
        return this.addressData.asObservable().pipe(map(data => {
            return data.addressGroups.map(it => {
                const avatar = it.addresses.slice(it.addresses.length - 2).map(address => address.avatar);

                return {
                    id: it.id,
                    title: it.title,
                    avatar,
                    numberAddresses: it.addresses.length
                }
            }) as IAddressGroup[];
        }));
    }

    updateAddressGroups(addressGroups: IAddressGroupData[]): void {
        this.addressData.next({ ...this.addressData.value, addressGroups });
    }
}

export interface IAddressGroup {
    id: string;
    title: string;
    avatar: string[];
    numberAddresses: number;
}

export interface IAddressGroupData{
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
}
