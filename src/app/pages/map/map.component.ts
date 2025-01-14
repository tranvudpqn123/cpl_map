import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
// Services
import { MerchantFilterService} from '@services/merchant-filter.service';
// Components
import {SidebarComponent} from '@pages/map/sidebar/sidebar.component';
import {FilterComponent} from '@pages/map/filter/filter.component';
import {AutomaticallyUnsubscribe} from '@constants/automatically-unsubscribe';

//Interface
import {IMerchant} from '@models/merchant.interface';
import {NgForOf} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
    selector: 'app-map',
    standalone: true,
    imports: [
        SidebarComponent,
        FilterComponent,
        NgForOf,
        ReactiveFormsModule,
    ],
    templateUrl: './map.component.html',
    styleUrl: './map.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent extends AutomaticallyUnsubscribe implements OnInit{
    private readonly merchantFilterService = inject(MerchantFilterService);
    selectedMerchant = signal<IMerchant | null>(null);
    isShowMerchantGroups = signal<boolean>(false);
    listServiceTypeMerchant = signal<any[]>([]);
    // options: google.maps.MapOptions = {
    //     mapId: "DEMO_MAP_ID",
    //     center: { lat: -31, lng: 147 },
    //     zoom: 4,
    // };


    ngOnInit() {
        this.merchantFilterService.selectedMerchant$
            .subscribe(merchant => {
               this.selectedMerchant.set(merchant);
            });
        this.merchantFilterService.isShowMerchantGroups$
            .subscribe(isShowMerchantGroups => {
                this.isShowMerchantGroups.set(isShowMerchantGroups);
            })
        this.getListServiceType();
    }

    getListServiceType()   {
        this.merchantFilterService.getListServiceType().subscribe(res=>{
            console.log(res)
            const {data, code} = res;
            if(code === '200'){
                this.listServiceTypeMerchant.set(data);
            }
        })
    }



}
