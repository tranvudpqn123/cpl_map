import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {StorageService} from '@services/storage.service';
import {EStorageKey} from '@constants/storage-key';
import {EAddressGroupType, MerchantFilterService} from '@services/merchant-filter.service';
import {takeUntil} from 'rxjs';
import {AutomaticallyUnsubscribe} from '@constants/automatically-unsubscribe';
import {IconPaths} from '@constants/image-paths';
import {SafeSvgPipe} from '@pipes/safe-svg.pipe';
import {IAddressGroup} from '@models/address-merchant.interface';

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
    private readonly storageService = inject(StorageService);
    addressGroups = signal<IAddressGroup[]>([]);
    selectedAddressGroupId = signal('');
    selectedGroupType = signal<EAddressGroupType | null>(null);

    ngOnInit() {

        this.merchantFilterService.addressData$.subscribe((addressData) => {
            const dataLocal = JSON.parse(JSON.stringify(this.storageService.getItem(EStorageKey.LIST_SEND_PARTNER)));
            if(addressData.addressGroups.length < 1 && dataLocal.length > 0 ) {
                addressData.addressGroups = dataLocal;
            }
        })
        this.getListSeenMerchant();

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
    }


    getListSeenMerchant(){
        this.merchantFilterService.addressGroups$
            .pipe(takeUntil(this.destroyFlag))
            .subscribe((addressGroups) => {
                this.addressGroups.set(addressGroups);
            });
    }

    onSelectAddressGroup(addressGroupId: string) {
        this.merchantFilterService.updateSelectedAddressGroup(addressGroupId);
    }

    onShowCustomerGroup(addressGroupType: EAddressGroupType) {

        this.merchantFilterService.updateSelectedGroupType(addressGroupType);
    }


}
