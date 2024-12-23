import {Component, inject, OnInit, signal} from '@angular/core';
import * as L from 'leaflet';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {merchants, serviceTypes as serviceTypesData} from "./data";
import {CommonModule} from '@angular/common';
import {FilterComponent} from './filter/filter.component';
import {ESortType, IMerchant, IMerchantRequest, IServiceType} from '@models/merchant-request.interface';
import {HttpClient} from '@angular/common/http';
import {DotSeparatorPipe} from '@pipes/dot-separator.pipe';
import {ClickOutsideDirective} from '../../directive/click-outside';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FilterComponent,
        DotSeparatorPipe,
        ClickOutsideDirective
    ]
})
export class MapComponent implements OnInit {
    private readonly httpClient = inject(HttpClient);
    private markerLayer: L.LayerGroup = L.layerGroup();
    private map!: L.Map;
    private tiles = signal(L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        minZoom: 10,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }))
    private centroid: L.LatLngExpression = [21.040973510502976, 105.83468800262507];
    private originalMerchants = signal<any[]>([]);
    merchants = signal<any[]>([]);
    private selectedMerchant: IMerchant | null = null;

    focusedMerchant = signal<IMerchant | null>(null);
    loading = signal(false);
    test = signal(false);
    serviceTypes = new Map(serviceTypesData.map(item => [item.id, item]));
    searchForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.searchForm = this.fb.group({
            keySearch: ['']
        });


    }

    get keySearch(): FormControl {
        return this.searchForm.get('keySearch') as FormControl;
    }

    ngOnInit(): void {
        this.map = L.map('googleMap', {
            center: this.centroid,
            zoom: 13
        });

        // this.merchants = this.originalMerchants;


        // this.keySearch.valueChanges
        //     .pipe(debounceTime(500))
        //     .subscribe(keySearch => {
        //         this.merchants = this.originalMerchants.filter(item => this.isSubstringIgnoringAccent(keySearch, item.name));
        //         this.initMap(tiles);
        //
        //         if (this.merchants.length > 0) {
        //             const bounds = L.latLngBounds(
        //                 this.merchants.map(merchant => [merchant.latitude, merchant.longtitude])
        //             );
        //             this.map.fitBounds(bounds, { padding: [50, 50] }); // Optional: Add padding for better visibility
        //         }
        //     });

        this.getMerchants({
            keySearch: '',
            serviceTypeId: '',
            sortBy: ESortType.TOTAL_BILL,
            pageSize: 500
        })

    }

    onSearch(request: IMerchantRequest) {
        this.getMerchants(request);
        this.focusedMerchant.set(this.merchants()[0]);
        this.test.set(true);
    }


    private updateMerchantStyles(merchantId: string, backgroundColor: string, color: string, saveOriginal: boolean = false): void {
        const nodes = document.querySelectorAll('.marker-icon[data-merchant-id="' + merchantId.toLowerCase() + '"]');
        nodes.forEach(node => {
            const element = node as HTMLElement;

            if (saveOriginal && !element.getAttribute('data-original-bg-color')) {
                element.setAttribute('data-original-bg-color', element.style.backgroundColor || 'white');
            }
            element.style.backgroundColor = backgroundColor;
            element.style.color = color;
        });
    }
    onSelectMerchant(merchant: IMerchant): void {
        if (this.selectedMerchant) {
            this.updateMerchantStyles(this.selectedMerchant.id,
                this.selectedMerchant.color || 'white',
                '',
                false);
            this.selectedMerchant.selected = false;
        }

        merchant.selected = true;
        this.selectedMerchant = merchant;

        this.updateMerchantStyles(merchant.id,
            'red',
            'white',
            true);

        if (merchant.selected) {
            this.focusedMerchant.set(merchant);
        }
    }



    onCloseMerchantDetail() {
        this.focusedMerchant.set(null);
    }

    private initMap(tiles: any): void {
        // Clear existing markers
        this.markerLayer.clearLayers();

        // Add new markers
        this.merchants().forEach((merchant: IMerchant, index) => {
            if (merchant && merchant.latitude && merchant.longtitude) {
                const customDivIcon = L.divIcon({
                    className: 'custom-marker', // CSS class for styling
                    html: '<div style="background-color:' + merchant.color + '" class="marker-icon" data-service-id="' + merchant.service_type_id + '" data-merchant-id="' + merchant.id + '">' +
                        '<div class="thumbnail"><img src="' + merchant.service_type_icons + '" alt="icon" width="15px" height="15px"></div>' +
                        '<span>' + merchant.orderNumber + '</span>' +
                        '</div>', // Custom HTML inside the marker
                    iconSize: [44, 40], // Size of the icon
                    iconAnchor: [15, 15] // Anchor point of the icon
                });
                const marker = L.marker([merchant.latitude, merchant.longtitude], {icon: customDivIcon});

                marker.on('click', () => {
                    this.map.setView([merchant.latitude, merchant.longtitude], 16);
                    this.onSelectMerchant(merchant);
                });
                marker.addTo(this.markerLayer); // Add marker to LayerGroup

            }
        });

        // Add LayerGroup to map
        this.markerLayer.addTo(this.map);

        // Add tiles to map
        tiles.addTo(this.map);
    }




    private isSubstringIgnoringAccent(substring: string, mainString: string): boolean {
        const normalize = (str: string) =>
            str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

        const normalizedSubstring = normalize(substring);
        const normalizedMainString = normalize(mainString);
        return normalizedMainString.includes(normalizedSubstring);
    }

    private getMerchants(request: IMerchantRequest) {
        const {keySearch, serviceTypeId, pageSize, sortBy} = request;
        const url = `https://apigw.cashplus.vn/api/app/customer/home/listPartnerV2?page_size=${pageSize}`;
        const req = {
            is_include_report: true
        }
        if (this.originalMerchants().length === 0) {
            this.loading.set(true);
            this.httpClient.post(url, req).subscribe((res: any) => {
                let {code, data: {data}} = res;
                if (code === '200') {
                    if (serviceTypeId) {
                        const service = this.serviceTypes.get(serviceTypeId);

                        if (service) {
                            data = data.filter((merchant: IMerchant) => service.partnerIds.includes(merchant.id.toUpperCase()));
                        }
                    }

                    if (sortBy === ESortType.TOTAL_BILL) {
                        data.sort((a: IMerchant, b: IMerchant) => b.total_bill - a.total_bill);
                    } else if (sortBy === ESortType.TOTAL_BILL_AMOUNT) {
                        data.sort((a: IMerchant, b: IMerchant) => b.total_bill_amount - a.total_bill_amount);
                    } else if (sortBy === ESortType.TOTAL_BILL_IN_MONTH) {
                        data.sort((a: IMerchant, b: IMerchant) => b.total_bill_in_month - a.total_bill_in_month);
                    } else if (sortBy === ESortType.TOTAL_BILL_AMOUNT_IN_MONTH) {
                        data.sort((a: IMerchant, b: IMerchant) => b.total_bill_amount_in_month - a.total_bill_amount_in_month);
                    }

                    data = data.map((merchant: any, index: number) => {
                        const service = (serviceTypesData as IServiceType[])
                            .find(service => service.partnerIds.includes(merchant.id.toUpperCase()));
                        return {...merchant, orderNumber: index, color: service?.color ?? ''};
                    });


                    this.merchants.set(data);
                    this.originalMerchants.set(data);
                    this.initMap(this.tiles());
                    if (data.length > 0) {
                        const bounds = L.latLngBounds(
                            data.map((merchant: IMerchant) => [merchant.latitude, merchant.longtitude])
                        );
                        this.map.fitBounds(bounds, {padding: [50, 50]}); // Optional: Add padding for better visibility
                    }
                    this.loading.set(false);
                }
            });
        } else {
            let data = this.originalMerchants();
            if (serviceTypeId) {
                const service = this.serviceTypes.get(serviceTypeId);

                if (service) {
                    data = data.filter((merchant: IMerchant) => service.partnerIds.includes(merchant.id.toUpperCase()));
                }
            }

            if (keySearch) {
                const keySearchFormatted = this.removeAccents(keySearch).toLowerCase();
                data = data.filter((merchant: IMerchant) => {
                    const merchantNameFormatted = this.removeAccents(merchant.name).toLowerCase();
                    return merchantNameFormatted.includes(keySearchFormatted);
                });
            }

            if (sortBy === ESortType.TOTAL_BILL) {
                data.sort((a: IMerchant, b: IMerchant) => b.total_bill - a.total_bill);
            } else if (sortBy === ESortType.TOTAL_BILL_AMOUNT) {
                data.sort((a: IMerchant, b: IMerchant) => b.total_bill_amount - a.total_bill_amount);
            } else if (sortBy === ESortType.TOTAL_BILL_IN_MONTH) {
                data.sort((a: IMerchant, b: IMerchant) => b.total_bill_in_month - a.total_bill_in_month);
            } else if (sortBy === ESortType.TOTAL_BILL_AMOUNT_IN_MONTH) {
                data.sort((a: IMerchant, b: IMerchant) => b.total_bill_amount_in_month - a.total_bill_amount_in_month);
            }

            data = data.map((merchant: any, index: number) => {
                const service = (serviceTypesData as IServiceType[])
                    .find(service => service.partnerIds.includes(merchant.id.toUpperCase()));
                return {...merchant, orderNumber: index, color: service?.color ?? ''};
            });


            this.merchants.set(data);
            this.initMap(this.tiles());
            if (data.length > 0) {
                const bounds = L.latLngBounds(
                    data.map((merchant: IMerchant) => [merchant.latitude, merchant.longtitude])
                );
                this.map.fitBounds(bounds, {padding: [50, 50],maxZoom: 18}); // Optional: Add padding for better visibility
            }
        }

    }

    private removeAccents(str: string): string {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

}
