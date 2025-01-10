import {ChangeDetectionStrategy, Component, inject, OnInit, signal, ViewChild} from '@angular/core';
import {IAddress, IAddressGroup, MerchantFilterService} from '@services/merchant-filter.service';
import {CommonModule, DecimalPipe} from '@angular/common';
import {StarRatingDirective} from 'directives/star-rating.directive';
import {CdkPortal} from '@angular/cdk/portal';
import {CdkConnectedOverlay, CdkOverlayOrigin, Overlay, OverlayConfig} from '@angular/cdk/overlay';

@Component({
    selector: 'app-filter',
    standalone: true,
    imports: [
        CommonModule,
        DecimalPipe,
        StarRatingDirective,
        CdkPortal,
        CdkOverlayOrigin,
        CdkConnectedOverlay
    ],
    templateUrl: './filter.component.html',
    styleUrl: './filter.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterComponent implements OnInit {
    @ViewChild(CdkPortal) portal!: CdkPortal;
    private readonly merchantFilterService = inject(MerchantFilterService);
    private readonly overlay = inject(Overlay);
    addressGroups = signal<IAddressGroup[]>([]);
    addresses = signal<IAddress[]>([]);
    selectedAddressGroupId = signal('');
    isShowListAddressGroups = signal(false);
    isShowResultSearch = signal(true);

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
                console.log('addresses', addresses);
                this.addresses.set(addresses);
            });
        this.merchantFilterService.isShowListAddressGroups$
            .subscribe((isShowListAddressGroups) => {
                this.isShowListAddressGroups.set(isShowListAddressGroups);
            });
    }

    onSelectAddressGroup(addressGroupId: string) {
        this.merchantFilterService.updateSelectedAddressGroup(addressGroupId);
    }

    onFocusSearchBox() {
        this.isShowResultSearch.set(true);

        const config = new OverlayConfig({
            hasBackdrop: true
        })
        const overlayRef = this.overlay.create(config);
        overlayRef.attach(this.portal);
        overlayRef.backdropClick().subscribe(() => overlayRef.dispose());

    }
}
