import {AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
// Services
import {CategoryService} from '@services/category.service';
import {EAddressGroupType, MerchantFilterService} from '@services/merchant-filter.service';

// Components
import {SidebarComponent} from '@pages/map/sidebar/sidebar.component';
import {FilterComponent} from '@pages/map/filter/filter.component';
import {PersonalGroupsComponent} from '@pages/map/personal-groups/personal-groups.component';

import {AutomaticallyUnsubscribe} from '@constants/automatically-unsubscribe';
import {IMerchant} from '@models/merchant.interface';
import {NgForOf, NgIf} from '@angular/common';
import {ICategory} from '@models/category.interface';
import {ClickOutsideDirective} from 'directives/click-outside.directive';
import {GoogleMapsModule} from '@angular/google-maps';


@Component({
    selector: 'app-map',
    standalone: true,
    imports: [
        SidebarComponent,
        FilterComponent,
        PersonalGroupsComponent,
        GoogleMapsModule,
        NgForOf,
        NgIf,
        ClickOutsideDirective
    ],
    templateUrl: './map.component.html',
    styleUrl: './map.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent extends AutomaticallyUnsubscribe implements OnInit{
    private readonly merchantFilterService = inject(MerchantFilterService);
    private readonly categoryService = inject(CategoryService);
    selectedMerchant = signal<IMerchant | null>(null);
    isShowMerchantGroups = signal<boolean>(false);
    selectedGroupType = signal<EAddressGroupType | null>(null);
    map: google.maps.Map | null = null;
    markers: any[] = [];

    listServiceTypeMerchant = signal<ICategory[]>([]);
    listSubTypeService = signal<ICategory[] >([]);
    selectedServiceId = signal<string | null>(null);
    serviceTypeSelected = ''

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
        this.getListServiceType();
    };


    getListServiceType()   {
        this.categoryService.getListServiceType().subscribe(res => {
            const { data, code } = res;
            if (code === '200') {
                this.listServiceTypeMerchant.set(data);
            }
        })
    }

    toggleSubServiceList(serviceId: string) {
        this.selectedServiceId.set(serviceId);
        this.categoryService.getListSubServiceType(serviceId.toString()).subscribe(res => {
            const { data, code } = res;
            if (code === '200') {
                this.listSubTypeService.set(data);
            }
        })
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
