import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
    signal,
    TemplateRef,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {AutomaticallyUnsubscribe} from '@constants/automatically-unsubscribe';
import {
    EAddressGroupType,
    EMerchantGroupType,
    ESystemMerchantGroupType,
    IListAddress,
    IMerchantGroup,
    MerchantFilterService
} from '@services/merchant-filter.service';
import {takeUntil} from 'rxjs';
import {IconPaths} from '@constants/image-paths';
import {SafeSvgPipe} from '@pipes/safe-svg.pipe';
import {Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay';
import {CdkPortal, PortalModule, TemplatePortal} from '@angular/cdk/portal';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {IMerchant} from '@models/merchant.interface';
import {IAddressGroup} from '@models/address-merchant.interface';
import {FilterPipe} from '@pipes/filter.pipe';

@Component({
    selector: 'app-personal-groups',
    standalone: true,
    imports: [
        CommonModule,
        SafeSvgPipe,
        PortalModule,
        FormsModule,
        FilterPipe
    ],
    templateUrl: './personal-groups.component.html',
    styleUrl: './personal-groups.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonalGroupsComponent extends AutomaticallyUnsubscribe implements OnInit{
    @ViewChild(CdkPortal) portal!: CdkPortal;
    @ViewChild('contextMenuTemplate', {static: true}) contextMenuTemplate!: TemplateRef<any>;

    private readonly overlay = inject(Overlay);
    private readonly viewContainerRef = inject(ViewContainerRef);
    private readonly merchantFilterService = inject(MerchantFilterService);
    protected readonly IconPaths = IconPaths;
    protected readonly EAddressGroupType = EAddressGroupType;
    private overlayRef: OverlayRef | null = null;

    selectedGroup = signal<IMerchantGroup | null>(null);
    merchants = signal<IMerchant[]>([]);
    selectedMerchant = signal<IMerchant | null>(null);
    selectedGroupType = signal<EAddressGroupType | null>(EAddressGroupType.SAVED);
    listAddress = signal<IListAddress[]>([]);
    openAddListForm = signal(false);
    addressGroups = signal<IAddressGroup[]>([]);
    selectedAddressGroupId = signal('');
    merchantGroups = signal<IMerchantGroup[]>([])

    newGroupName = '';


    ngOnInit() {
        this.merchantFilterService.selectedAddressGroupId$
            .pipe(takeUntil(this.destroyFlag))
            .subscribe((selectedAddressGroupId) => {
                console.log('selectedAddressGroupId', selectedAddressGroupId);
                // this.selectedAddressGroupId.set(selectedAddressGroupId);
            });
        this.merchantFilterService.listAddress$
            .pipe(takeUntil(this.destroyFlag))
            .subscribe((listAddress) => {
                this.listAddress.set(listAddress);
            });
        this.merchantFilterService.selectedGroupType$
            .pipe(takeUntil(this.destroyFlag))
            .subscribe((selectedGroupType) => {
                this.selectedGroupType.set(selectedGroupType);
            });

        this.merchantFilterService.selectedMerchant$
            .pipe(takeUntil(this.destroyFlag))
            .subscribe((selectedMerchant) => {
                this.selectedMerchant.set(selectedMerchant);
            });

        this.merchantFilterService.addressGroups$
            .pipe(takeUntil(this.destroyFlag))
            .subscribe((addressGroups) => {
                this.addressGroups.set(addressGroups);
            });

        this.merchantFilterService.selectedAddressGroupId$
            .pipe(takeUntil(this.destroyFlag))
            .subscribe((selectedAddressGroupId) => {
                this.selectedAddressGroupId.set(selectedAddressGroupId);
                const selectedGroup = this.addressGroups()?.find(group => group.id === selectedAddressGroupId);

            });

        this.merchantFilterService.merchantGroups_v2$
            .pipe(takeUntil(this.destroyFlag))
            .subscribe((merchantGroups) => {
                this.merchantGroups.set(merchantGroups.filter(group =>
                    group.type === EMerchantGroupType.CUSTOM
                    || group.type === EMerchantGroupType.SYSTEM
                ));
            });

    }

    onOpenAddListForm() {
        this.openAddListForm.set(true);

        const config: OverlayConfig = {
            hasBackdrop: true,
            positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically()
        };

        this.overlayRef = this.overlay.create(config);
        this.overlayRef.attach(this.portal);
        this.overlayRef.backdropClick().subscribe(() => this.onCloseCreateGroupForm());

        const inputElm = document.querySelector('.form-add-new-list .form-control') as HTMLElement;
        if (inputElm) {
            inputElm.focus();
        }
    }

    onOpenContextMenu(selectedGroup: IMerchantGroup, event: MouseEvent) {
        event.stopPropagation();
        if (this.overlayRef) {
            this.overlayRef.dispose();
        }

        const currentTarget = event.currentTarget as HTMLElement;
        if (currentTarget) {
            const currentElement = currentTarget.getBoundingClientRect();
            this.selectedGroup.set(selectedGroup);

            this.overlayRef = this.overlay.create({
                positionStrategy: this.overlay
                    .position()
                    .flexibleConnectedTo({x: currentElement.x + currentElement.width, y: currentElement.y + currentElement.height})
                    .withPositions([{originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 4}]),
                hasBackdrop: true,
                backdropClass: 'cdk-overlay-transparent-backdrop',
            });

            const portal = new TemplatePortal(this.contextMenuTemplate, this.viewContainerRef);

            this.overlayRef.attach(portal);
            this.overlayRef.backdropClick().subscribe(() => {
                this.overlayRef!.dispose();
            });
        }
    }

    onSaveGroup() {
        if (this.newGroupName && this.overlayRef) {
            const id = this.selectedGroup()?.id || '';
            this.merchantFilterService.createOrUpdateMerchantGroup({
                id,
                title: this.newGroupName,
                icon: IconPaths.LIST_BULLETED_LG,
                merchants: [],
                type: EMerchantGroupType.CUSTOM,
                avatars: [],
                showOnSidebar: false,
            });
            this.onCloseCreateGroupForm();
        };
    }

    onRemoveGroup() {
        const selectedGroup = this.selectedGroup();;
        if (selectedGroup) {
            this.merchantFilterService.removeMerchantGroup(selectedGroup.id);
            this.selectedGroup.set(null);
            this.overlayRef?.detach();
        }
    }

    onEditList() {
        const selectedList = this.selectedGroup();;
        if (selectedList) {
            this.newGroupName = selectedList.title;
            this.overlayRef?.detach();
            this.onOpenAddListForm();
        }
    }

    onCloseCreateGroupForm() {
        if (this.overlayRef) {
            this.overlayRef.detach();
            this.newGroupName = '';
        }
    }

    onSelectList(selectedGroupId: string) {
        // this.merchantFilterService.selectListAddress(list.id);
    }

    onMerchantFromGroup(event: MouseEvent, listId: string, merchantId: string) {
        event.stopPropagation();
        this.merchantFilterService.removeFromList(listId, merchantId);
    }

    onSelectMerchant(merchant: IMerchant) {
        this.merchantFilterService.updateSelectedMerchant(merchant);
    }

    protected readonly ESystemMerchantGroupType = ESystemMerchantGroupType;
    protected readonly EMerchantGroupType = EMerchantGroupType;
}
