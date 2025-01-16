import {AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {GoogleMapsModule} from '@angular/google-maps';
// Services
import {EAddressGroupType} from '@services/merchant-filter.service';
import { MerchantFilterService} from '@services/merchant-filter.service';
// Components
import {SidebarComponent} from '@pages/map/sidebar/sidebar.component';
import {SliderPhotosComponent} from '@pages/map/slider-photos/slider-photos.component';
import {FilterComponent} from '@pages/map/filter/filter.component';
import {PersonalGroupsComponent} from '@pages/map/personal-groups/personal-groups.component';
import {AddressDetailComponent} from '@pages/map/address-detail/address-detail.component';
import {AutomaticallyUnsubscribe} from '@constants/automatically-unsubscribe';

//Interface
import {IMerchant} from '@models/merchant.interface';

import {MapAdvancedMarker} from '@angular/google-maps';

@Component({
    selector: 'app-map',
    standalone: true,
    imports: [
        SidebarComponent,
        SliderPhotosComponent,
        FilterComponent,
        PersonalGroupsComponent,
        AddressDetailComponent,
        GoogleMapsModule
    ],
    templateUrl: './map.component.html',
    styleUrl: './map.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent extends AutomaticallyUnsubscribe implements OnInit, AfterViewInit{
    private readonly merchantFilterService = inject(MerchantFilterService);
    selectedMerchant = signal<IMerchant | null>(null);
    isShowMerchantGroups = signal<boolean>(false);
    selectedGroupType = signal<EAddressGroupType | null>(null);
    map: google.maps.Map | null = null;
    markers: any[] = [];

    ngOnInit() {
        this.merchantFilterService.selectedMerchant$
            .subscribe((merchant) => {
               this.selectedMerchant.set(merchant);

               if (this.map && merchant) {
                   this.setMarkers(this.map, [merchant]);
               }
            });
        this.merchantFilterService.isShowMerchantGroups$
            .subscribe(isShowMerchantGroups => {
                this.isShowMerchantGroups.set(isShowMerchantGroups);
            });

        this.merchantFilterService.selectedGroupType$
            .subscribe(selectedGroupType => {
                this.selectedGroupType.set(selectedGroupType);
            });
    }

    ngAfterViewInit() {
        window.setTimeout(() => {
            this.initMap()
        }, 300);
    }

    private async initMap() {
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

        this.map = new google.maps.Map(
            document.getElementById("map") as HTMLElement,
            {
                center: { lat: 21.02930786179391, lng: 105.83593350505639 },
                zoom: 15,
                mapId: '4504f8b37365c3d0',
            }
        );


        this.markers.push(new AdvancedMarkerElement({
            map: this.map,
            position: { lat: 21.02930786179391, lng: 105.83593350505639 },
        }));

    }

    private async setMarkers(map: google.maps.Map, merchants: IMerchant[]) {
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
        this.markers.forEach(marker => {
            marker.setMap(null);
        });
        this.markers = [];

        const lat = merchants[0].latitude;
        const lng = merchants[0].longtitude;
        map.panTo({ lat, lng });

        merchants.forEach(merchant => {
            this.markers.push(new AdvancedMarkerElement({
                map,
                position: { lat: merchant.latitude, lng: merchant.longtitude },
            }));
        });


        this.fitMapToBounds(this.markers, map);

    }

    private fitMapToBounds(markers: any[], map: google.maps.Map) {
        if (markers.length === 0) return;

        // Create a new LatLngBounds object
        const bounds = new google.maps.LatLngBounds();

        // Extend the bounds to include each marker's position
        markers.forEach((marker) => {
            bounds.extend(marker.position);
        });

        // Fit the map to the calculated bounds
        map.panToBounds(bounds, 50);
    }
}
