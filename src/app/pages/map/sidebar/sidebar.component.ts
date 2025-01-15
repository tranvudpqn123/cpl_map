import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {EAddressGroupType, IAddressGroup, IListAddress, MerchantFilterService} from '@services/merchant-filter.service';
import {takeUntil} from 'rxjs';
import {AutomaticallyUnsubscribe} from '@constants/automatically-unsubscribe';
import {IconPaths} from '@constants/image-paths';
import {SafeSvgPipe} from '@pipes/safe-svg.pipe';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [
        SafeSvgPipe
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent extends AutomaticallyUnsubscribe implements OnInit {
    protected readonly EAddressGroupType = EAddressGroupType;
    protected readonly IconPaths = IconPaths;
    private readonly merchantFilterService = inject(MerchantFilterService);
    addressGroups = signal<IAddressGroup[]>([]);
    selectedAddressGroupId = signal('');
    selectedGroupType = signal<EAddressGroupType | null>(null);
    selectedListAddress = signal<IListAddress | null>(null);

    ngOnInit() {
        this.merchantFilterService.addressGroups$
            .pipe(takeUntil(this.destroyFlag))
            .subscribe((addressGroups) => {
                this.addressGroups.set(addressGroups);
            });

        this.merchantFilterService.selectedAddressGroupId$
            .pipe(takeUntil(this.destroyFlag))
            .subscribe((selectedAddressGroupId) => {
                this.selectedAddressGroupId.set(selectedAddressGroupId);
            });

        this.merchantFilterService.selectedGroupType$
            .pipe(takeUntil(this.destroyFlag))
            .subscribe(selectedGroupType => {
                this.selectedGroupType.set(selectedGroupType);
            });

        this.merchantFilterService.selectedListAddress$
            .pipe(takeUntil(this.destroyFlag))
            .subscribe(selectedListAddress => {
                this.selectedListAddress.set(selectedListAddress);
            });
    }

    onSelectAddressGroup(addressGroupId: string) {
        this.merchantFilterService.updateSelectedAddressGroup(addressGroupId);
    }

    onShowCustomerGroup(addressGroupType: EAddressGroupType) {

        this.merchantFilterService.updateSelectedGroupType(addressGroupType);
    }


}
