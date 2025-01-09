import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {IAddress, IAddressGroup, MerchantFilterService} from '@services/merchant-filter.service';
import {CommonModule, DecimalPipe} from '@angular/common';
import {StarRatingDirective} from 'directives/star-rating.directive';

@Component({
    selector: 'app-filter',
    standalone: true,
    imports: [
        CommonModule,
        DecimalPipe,
        StarRatingDirective
    ],
    templateUrl: './filter.component.html',
    styleUrl: './filter.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterComponent implements OnInit {
    private readonly merchantFilterService = inject(MerchantFilterService);
    addressGroups = signal<IAddressGroup[]>([]);
    addresses = signal<IAddress[]>([]);
    selectedAddressGroupId = signal('');

    ngOnInit() {
        this.merchantFilterService.addressGroups$
            .subscribe((addressGroups) => {
                this.addressGroups.set(addressGroups);
            });

        this.merchantFilterService.selectedAddressGroupId$
            .subscribe((selectedAddressGroupId) => {
                this.selectedAddressGroupId.set(selectedAddressGroupId);
            });

        this.merchantFilterService.addresses$
            .subscribe((addresses) => {
                this.addresses.set(addresses);
            });
    }

    onSelectAddressGroup(addressGroupId: string) {
        this.merchantFilterService.updateSelectedAddressGroup(addressGroupId);
    }
}
