import {Component, inject, OnInit, signal} from '@angular/core';
import * as L from 'leaflet';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {debounceTime} from "rxjs/operators";
import {merchants as merchantsData, serviceTypes as serviceTypesData} from "./data";
import {CommonModule} from '@angular/common';
import {FilterComponent} from './filter/filter.component';
import {IMerchant, IMerchantRequest} from '@models/merchant-request.interface';
import {HttpClient} from '@angular/common/http';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FilterComponent
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
    focusedMerchant = signal<IMerchant | null>(null);

    serviceTypes = serviceTypesData;
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
            sortBy: 'BILL_COUNT',
            pageSize: 10000
        })

    }

    onSearch(request: IMerchantRequest) {
        console.log('search: ', request);
        this.getMerchants(request);
    }

    onSelectServiceType(serviceType: any): void {
        serviceType.selected = !serviceType.selected;
        const nodes = document.querySelectorAll('.marker-icon[data-service-id="' + serviceType.id.toLowerCase() + '"]');

        if (serviceType.selected) {
            nodes.forEach(node => {
                const element = node as HTMLElement; // Cast to HTMLElement if needed
                element.style.backgroundColor = 'red';
                element.style.color = 'white';
            });
        } else {
            nodes.forEach(node => {
                const element = node as HTMLElement; // Cast to HTMLElement if needed
                element.style.backgroundColor = 'white';
                element.style.color = 'gray';
            });
        }
    }

    onSelectMerchant(merchant: IMerchant): void {
        merchant.selected = !merchant.selected;

        const nodes = document.querySelectorAll('.marker-icon[data-merchant-id="' + merchant.id.toLowerCase() + '"]');

        if (merchant.selected) {
            this.focusedMerchant.set(merchant);
            nodes.forEach(node => {
                const element = node as HTMLElement; // Cast to HTMLElement if needed
                element.style.backgroundColor = 'red';
                element.style.color = 'white';
            });
        } else {
            nodes.forEach(node => {
                const element = node as HTMLElement; // Cast to HTMLElement if needed
                element.style.backgroundColor = 'white';
                element.style.color = 'gray';
            });
        }
    }

    onCloseMerchantDetail() {
        this.focusedMerchant.set(null);
    }

    private initMap(tiles: any): void {
        // Clear existing markers
        this.markerLayer.clearLayers();

        // Add new markers
        this.merchants().forEach((merchant: any, index) => {
            if (merchant && merchant.latitude && merchant.longtitude) {
                const customDivIcon = L.divIcon({
                    className: 'custom-marker', // CSS class for styling
                    html: '<div class="marker-icon" data-service-id="' + merchant.service_type_id + '" data-merchant-id="' + merchant.id + '">' +
                        '<div class="thumbnail"><img src="' + merchant.service_type_icons + '" alt="icon" width="15px" height="15px"></div>' +
                        '<span>' + merchant.orderNumber + '</span>' +
                        '</div>', // Custom HTML inside the marker
                    iconSize: [44, 40], // Size of the icon
                    iconAnchor: [15, 15] // Anchor point of the icon
                });
                const marker = L.marker([merchant.latitude, merchant.longtitude], {icon: customDivIcon});
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
        const {keySearch, serviceTypeId, pageSize} = request;
        const url = `https://apigw.cashplus.vn/api/app/customer/home/listPartnerV2?page_size=${pageSize}`;
        const req = {
            search: keySearch,
            service_type_id: serviceTypeId || null,
            is_include_report: false
        }
        this.httpClient.post(url, req).subscribe((res: any) => {
            let {code, data: {data}} = res;
            if (code === '200') {
                data = data.map((item: any, index: number) => ({...item, orderNumber: index}));
                this.merchants.set(data);
                this.originalMerchants.set(data);
                this.initMap(this.tiles());
            }
        });
    }

}
