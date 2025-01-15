import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
// Services
import { MerchantFilterService} from '@services/merchant-filter.service';
// Components
import {SidebarComponent} from '@pages/map/sidebar/sidebar.component';
import {FilterComponent} from '@pages/map/filter/filter.component';
import {AutomaticallyUnsubscribe} from '@constants/automatically-unsubscribe';
import {IMerchant} from '@models/merchant.interface';
import {NgForOf, NgIf} from '@angular/common';
import {CategoryService} from '@services/category.service';
import {ICategory} from '@models/category.interface';

@Component({
    selector: 'app-map',
    standalone: true,
    imports: [
        SidebarComponent,
        FilterComponent,
        NgForOf,
        NgIf,
    ],
    templateUrl: './map.component.html',
    styleUrl: './map.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent extends AutomaticallyUnsubscribe implements OnInit {
    private readonly merchantFilterService = inject(MerchantFilterService);
    private readonly categoryService = inject(CategoryService);
    selectedMerchant = signal<IMerchant | null>(null);
    isShowMerchantGroups = signal<boolean>(false);

    listServiceTypeMerchant = signal<ICategory[]>([]);
    listSubTypeService = signal<ICategory[] >([]);
    selectedServiceId = signal<string | null>(null);
    serviceTypeSelected = ''

    ngOnInit() {
        this.merchantFilterService.selectedMerchant$
            .subscribe((merchant) => {
                this.selectedMerchant.set(merchant);
            });
        this.merchantFilterService.isShowMerchantGroups$
            .subscribe(isShowMerchantGroups => {
                this.isShowMerchantGroups.set(isShowMerchantGroups);
            })
        this.getListServiceType();
    }

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

    valueService(type: string) {
        this.serviceTypeSelected = type;
        this.listSubTypeService.set([]);
    }
}

