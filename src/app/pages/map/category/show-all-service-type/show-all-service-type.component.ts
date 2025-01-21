import {
    ChangeDetectionStrategy,
    Component,
    CUSTOM_ELEMENTS_SCHEMA,
    inject, Input,
    OnInit, signal,
} from '@angular/core';
import {Swiper} from 'swiper';
import {RedZoomModule} from 'ngx-red-zoom';
import {IAddress, IAddressGroup, IAddressImageGroup} from '@models/address-merchant.interface';
import {IServiceType, MerchantFilterService} from '@services/merchant-filter.service';
import {CommonModule} from '@angular/common';
import {CategoryService} from '@services/category.service';
import {ICategory} from '@models/category.interface';

@Component({
    selector: 'app-show-service-type',
    standalone: true,
    templateUrl: './show-all-service-type.component.html',
    styleUrl: './show-all-service-type.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RedZoomModule, CommonModule],
})
export class ShowAllServiceTypeComponent implements OnInit {
    private readonly categoryService = inject(CategoryService);
    listServiceTypes = signal<IServiceType[]>([])
    listSubServiceTypes = signal<IServiceType[]>([])
    ngOnInit() {
        this.categoryService.listServiceType.subscribe(data=>{
            console.log(data);
            this.listServiceTypes.set(data);
        })

        this.categoryService.listServiceType.subscribe(data=>{
            console.log(data);
            this.listServiceTypes.set(data);
        })
    }


}
