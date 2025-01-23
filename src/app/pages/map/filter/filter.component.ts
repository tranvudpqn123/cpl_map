import {
    ChangeDetectionStrategy,
    Component,
    inject,
    Input, OnChanges,
    OnInit,
    signal, SimpleChanges,
    ViewChild
} from '@angular/core';
import {
    EAddressGroupType, IMerchantGroup, IServiceType, ISubServiceType,
    MerchantFilterService
} from '@services/merchant-filter.service';
import {CommonModule, DecimalPipe} from '@angular/common';
import {StarRatingDirective} from 'directives/star-rating.directive';
import {CdkPortal} from '@angular/cdk/portal';
import {CdkConnectedOverlay, CdkOverlayOrigin, ConnectedPosition} from '@angular/cdk/overlay';
import {SafeSvgPipe} from '@pipes/safe-svg.pipe';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, skip, take, takeUntil} from 'rxjs';
import {AutomaticallyUnsubscribe} from '@constants/automatically-unsubscribe';
import {AddressDetailComponent} from '@pages/map/address-detail/address-detail.component';
import {IAddress, IAddressGroup, IAddressGroupData} from '@models/address-merchant.interface';
import {IMerchant, IMerchantFilterRequest} from '@models/merchant.interface';
import {StorageService} from '@services/storage.service';

const PIN_ICON = `<svg class="c-text-gray" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480.14-490.77q26.71 0 45.59-19.02 18.89-19.02 18.89-45.73 0-26.71-19.03-45.6Q506.57-620 479.86-620q-26.71 0-45.59 19.02-18.89 19.02-18.89 45.73 0 26.71 19.03 45.6 19.02 18.88 45.73 18.88ZM480-172.92q112.77-98.16 178.31-199.66t65.54-175.57q0-109.77-69.5-181.2-69.5-71.42-174.35-71.42t-174.35 71.42q-69.5 71.43-69.5 181.2 0 74.07 65.54 175.57T480-172.92Zm0 53.69Q339-243.92 267.58-351.81q-71.43-107.88-71.43-196.34 0-126.93 82.66-209.39Q361.46-840 480-840q118.54 0 201.19 82.46 82.66 82.46 82.66 209.39 0 88.46-71.43 196.34Q621-243.92 480-119.23Zm0-436.15Z"/></svg>`;
const CLOCK_ICON = `<svg class="c-text-gray" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m625.85-305.85 28.3-28.3L500-488.33V-680h-40v208.31l165.85 165.84ZM480.13-120q-74.67 0-140.41-28.34-65.73-28.34-114.36-76.92-48.63-48.58-76.99-114.26Q120-405.19 120-479.87q0-74.67 28.34-140.41 28.34-65.73 76.92-114.36 48.58-48.63 114.26-76.99Q405.19-840 479.87-840q74.67 0 140.41 28.34 65.73 28.34 114.36 76.92 48.63 48.58 76.99 114.26Q840-554.81 840-480.13q0 74.67-28.34 140.41-28.34 65.73-76.92 114.36-48.58 48.63-114.26 76.99Q554.81-120 480.13-120ZM480-480Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/></svg>`;

@Component({
    selector: 'app-filter',
    standalone: true,
    imports: [
        CommonModule,
        CdkOverlayOrigin,
        CdkConnectedOverlay,
        ReactiveFormsModule,
        // Pipes
        SafeSvgPipe,
    ],
    templateUrl: './filter.component.html',
    styleUrl: './filter.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterComponent extends AutomaticallyUnsubscribe implements OnInit, OnChanges {
    @ViewChild(CdkPortal) portal!: CdkPortal;
    @Input() keyS = '';


    private readonly merchantFilterService = inject(MerchantFilterService);
    private readonly fb = inject(FormBuilder);

    readonly searchFrom = this.fb.group({
        keySearch: [this.keyS],
        subServiceTypeId: [''],
    });
    selectedAddressGroupId = signal('');
    isShowResultSearch = signal(false);

    responseMerchants = signal<IMerchant[]>([]);
    options = signal<IAddressOption[]>([]);
    selectedMerchant = signal<IMerchant | null>(null);
    selectedSubService = signal<ISubServiceType | null>(null);
    mapServices = signal<Map<string, IServiceType>>(new Map());
    merchantGroups = signal<IMerchantGroup[]>([]);
    merchants = signal<IMerchant[]>([]);

    customPositions: ConnectedPosition[] = [
        {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top'
        }
    ];


    ngOnChanges(changes: SimpleChanges): void {
        if (changes['keyS'] && changes['keyS'].currentValue !== changes['keyS'].previousValue) {
            this.searchFrom.patchValue({ keySearch: this.keyS });
        }
    }

    ngOnInit() {
        this.merchantFilterService.selectedMerchant$
            .subscribe(merchant => {
                this.selectedMerchant.set(merchant);
            });

        this.searchFrom.valueChanges
            .pipe( debounceTime(500))
            .subscribe(() => {
                this.isShowResultSearch.set(true);
                this.getMerchants(this.merchants());
            });

        this.merchantFilterService.selectedSubService$
            .pipe(takeUntil(this.destroyFlag))
            .subscribe(selectedSubService => {
                this.selectedSubService.set(selectedSubService);
                this.searchFrom.patchValue({
                    keySearch: selectedSubService?.name ?? '',
                    subServiceTypeId: selectedSubService?.id ?? null
                });
            });

        this.merchantFilterService.serviceTypes$
            .pipe(take(2))
            .subscribe(selectedSubService => {
                const mapServices = new Map<string, IServiceType>();
                selectedSubService.forEach(service => {
                    mapServices.set(service.id, service);
                });
                this.mapServices.set(mapServices);
            });

        this.merchantFilterService.merchantGroups_v2$
            .pipe(takeUntil(this.destroyFlag))
            .subscribe(merchantGroups => {
                const selectedGroup = merchantGroups.find(group => group.selected);
                merchantGroups = merchantGroups.filter(group => group.showOnSidebar);
                this.merchantGroups.set(merchantGroups);
                this.merchants.set(selectedGroup?.merchants ?? []);
                this.selectedAddressGroupId.set(selectedGroup?.id ?? 'ALL');
            });
    }

    onSelectAddressOption(addressOption: IAddressOption) {
        const selectedMerchant = this.responseMerchants().find(it => it.id === addressOption.id);
        if (selectedMerchant) {
            this.searchFrom.reset({keySearch: selectedMerchant.name}, {emitEvent: false});
            const service = this.mapServices().get(selectedMerchant.serviceTypeId);
            if (service) {
                selectedMerchant.serviceName = service.name;
            }
            this.merchantFilterService.updateSelectedMerchant(selectedMerchant);
            this.merchantFilterService.addToList(selectedMerchant.serviceTypeId, selectedMerchant);
        }
        this.isShowResultSearch.set(false);
        this.merchantFilterService.updateSelectedGroupType(null);
    }

    onCloseAddressDetail() {
        this.merchantFilterService.updateSelectedMerchant(null);
        this.merchantFilterService.updateSelectedGroupType(null);

    }

    private getMerchants(recentMerchants: IMerchant[]) {
        const {keySearch, subServiceTypeId} = this.searchFrom.value;

        const request: IMerchantFilterRequest = {
            search: keySearch ?? '',
            subServiceTypeId: subServiceTypeId ?? '',
        };

        this.merchantFilterService.getMerchants(request)
            .subscribe(res => {
                const {code, data} = res;
                if (code === '200') {
                    const merchantOptions = data.data.map(it => {
                        const saved = recentMerchants.some(merchant => merchant.id === it.id);

                        const option: IAddressOption = {
                            id: it.id,
                            icon: saved ? CLOCK_ICON : PIN_ICON,
                            title: it.name,
                            address: it.fullAddress,
                            type: 'type',
                            saved
                        };
                        return option;
                    });
                    this.responseMerchants.set(data.data);
                    this.options.set(merchantOptions);
                }
            });
    }
}

export interface IAddressOption {
    id: string;
    icon: string;
    title: string;
    type: string;
    saved?: boolean;
    address: string;
}
