import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {MerchantFilterService} from '@services/merchant-filter.service';
import {IAddressGroup} from '@models/address-merchant.interface';
import {StorageService} from '@services/storage.service';
import {EStorageKey} from '@constants/storage-key';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {
    private readonly merchantFilterService = inject(MerchantFilterService);
    private readonly storageService = inject(StorageService);
    addressGroups = signal<IAddressGroup[]>([]);
    selectedAddressGroupId = signal('');

    ngOnInit() {
        this.merchantFilterService.addressData$.subscribe((addressData) => {
            const dataLocal = JSON.parse(JSON.stringify(this.storageService.getItem(EStorageKey.LIST_SEND_PARTNER)));
            if(addressData.addressGroups.length < 1 && dataLocal.length > 0 ) {
                addressData.addressGroups = dataLocal;
            }
        })
        this.getListSeenMerchant();

        this.merchantFilterService.selectedAddressGroupId$
            .subscribe((selectedAddressGroupId) => {
                this.selectedAddressGroupId.set(selectedAddressGroupId);
            });
    }


    getListSeenMerchant(){
        this.merchantFilterService.addressGroups$
            .subscribe((addressGroups) => {
                this.addressGroups.set(addressGroups);
            });
    }

    onSelectAddressGroup(addressGroupId: string) {
        this.merchantFilterService.updateSelectedAddressGroup(addressGroupId);
    }
}
