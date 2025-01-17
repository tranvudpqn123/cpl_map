import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
//Service
import {
    EAddressGroupType,
    EShowMerchantGroupType,
    IMerchantGroup,
    MerchantFilterService
} from '@services/merchant-filter.service';
import {StorageService} from '@services/storage.service';
import {EStorageKey} from '@constants/storage-key';
// rxjs
import {takeUntil} from 'rxjs';
import {AutomaticallyUnsubscribe} from '@constants/automatically-unsubscribe';
import {IconPaths} from '@constants/image-paths';
import {SafeSvgPipe} from '@pipes/safe-svg.pipe';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [
        CommonModule,
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
    merchantGroups = signal<IMerchantGroup[]>([]);

    selectedAddressGroupId = signal('');
    showMerchantGroupType = signal<EShowMerchantGroupType | null>(null);

    ngOnInit() {
        this.merchantFilterService.merchantGroups_v2$
            .pipe(takeUntil(this.destroyFlag))
            .subscribe((merchantGroups) => {
                this.merchantGroups.set(merchantGroups);
            });
        this.getListSeenMerchant();

        this.merchantFilterService.selectedAddressGroupId$
            .pipe(takeUntil(this.destroyFlag))
            .subscribe((selectedAddressGroupId) => {
                this.selectedAddressGroupId.set(selectedAddressGroupId);
            });

        this.merchantFilterService.showMerchantGroupType$
            .pipe(takeUntil(this.destroyFlag))
            .subscribe(showMerchantGroupType => {
                console.log('showMerchantGroupType', showMerchantGroupType);
                this.showMerchantGroupType.set(showMerchantGroupType);
            });
    }


    getListSeenMerchant(){
        // this.merchantFilterService.addressGroups$
        //     .subscribe((addressGroups) => {
        //         this.merchantGroups.set(addressGroups);
        //     });
    }

    onSelectAddressGroup(addressGroupId: string) {
        this.merchantFilterService.updateSelectedAddressGroup(addressGroupId);
        this.merchantFilterService.updateShowMerchantGroupType(EShowMerchantGroupType.HISTORY);

    }

    onShowCustomGroup(type: EShowMerchantGroupType) {
        this.merchantFilterService.updateShowMerchantGroupType(type);

    }


    protected readonly EShowMerchantGroupType = EShowMerchantGroupType;
}
