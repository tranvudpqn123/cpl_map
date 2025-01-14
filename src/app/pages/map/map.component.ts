import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {GoogleMapsModule} from '@angular/google-maps';
// Services
import {IMerchant, MerchantFilterService} from '@services/merchant-filter.service';
// Components
import {SidebarComponent} from '@pages/map/sidebar/sidebar.component';
import {SliderPhotosComponent} from '@pages/map/slider-photos/slider-photos.component';
import {FilterComponent} from '@pages/map/filter/filter.component';
import {PersonalGroupsComponent} from '@pages/map/personal-groups/personal-groups.component';
import {AddressDetailComponent} from '@pages/map/address-detail/address-detail.component';
import {AutomaticallyUnsubscribe} from '@constants/automatically-unsubscribe';

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
export class MapComponent extends AutomaticallyUnsubscribe implements OnInit{
    private readonly merchantFilterService = inject(MerchantFilterService);
    selectedMerchant = signal<IMerchant | null>(null);
    isShowMerchantGroups = signal<boolean>(false);
    options: google.maps.MapOptions = {
        mapId: "DEMO_MAP_ID",
        center: { lat: -31, lng: 147 },
        zoom: 4,
    };

    ngOnInit() {
        this.merchantFilterService.selectedMerchant$
            .subscribe(merchant => {
               this.selectedMerchant.set(merchant);
            });
        this.merchantFilterService.isShowMerchantGroups$
            .subscribe(isShowMerchantGroups => {
                this.isShowMerchantGroups.set(isShowMerchantGroups);
            })
    }
}
