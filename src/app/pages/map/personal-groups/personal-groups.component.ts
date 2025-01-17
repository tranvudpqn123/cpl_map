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
    EMerchantGroupType, EShowMerchantGroupType,
    ESystemMerchantGroupType,
    IListAddress,
    IMerchantGroup,
    MerchantFilterService
} from '@services/merchant-filter.service';
import {filter, takeUntil} from 'rxjs';
import {IconPaths} from '@constants/image-paths';
import {SafeSvgPipe} from '@pipes/safe-svg.pipe';
import {Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay';
import {CdkPortal, PortalModule, TemplatePortal} from '@angular/cdk/portal';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
// Models
import {IMerchant} from '@models/merchant.interface';
import {IAddressGroup} from '@models/address-merchant.interface';
import {FilterPipe} from '@pipes/filter.pipe';
import {StarRatingDirective} from 'directives/star-rating.directive';

@Component({
    selector: 'app-personal-groups',
    standalone: true,
    imports: [
        CommonModule,
        SafeSvgPipe,
        PortalModule,
        FormsModule,
        FilterPipe,
        StarRatingDirective,
    ],
    templateUrl: './personal-groups.component.html',
    styleUrl: './personal-groups.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonalGroupsComponent extends AutomaticallyUnsubscribe implements OnInit{
    @ViewChild(CdkPortal) portal!: CdkPortal;
    @ViewChild('contextMenuTemplate', {static: true}) contextMenuTemplate!: TemplateRef<any>;
    protected readonly EMerchantGroupType = EMerchantGroupType;
    protected readonly EShowMerchantGroupType = EShowMerchantGroupType;

    private readonly overlay = inject(Overlay);
    private readonly viewContainerRef = inject(ViewContainerRef);
    private readonly merchantFilterService = inject(MerchantFilterService);
    protected readonly IconPaths = IconPaths;
    private overlayRef: OverlayRef | null = null;

    selectedGroup = signal<IMerchantGroup | null>(null);
    selectedMerchant = signal<IMerchant | null>(null);
    showMerchantGroupType = signal<EShowMerchantGroupType | null>(null);
    openAddListForm = signal(false);
    addressGroups = signal<IAddressGroup[]>([]);
    systemMerchantGroups = signal<IMerchantGroup[]>([]);

    merchantGroups = signal<IMerchantGroup[]>([]);
    selectedMerchantGroupId = signal('');
    merchants = signal<IMerchant[]>([]);

    newGroupName = '';


    ngOnInit() {

        this.merchantFilterService.addressGroups$
            .pipe(takeUntil(this.destroyFlag))
            .subscribe((addressGroups) => {
                this.addressGroups.set(addressGroups);
            });

        this.merchantFilterService.merchantGroups_v2$
            .pipe(takeUntil(this.destroyFlag))
            .subscribe((merchantGroups) => {
                const systemMerchantGroups: IMerchantGroup[] = [];
                let selectedMerchantGroupId = this.selectedMerchantGroupId();
                let merchants: IMerchant[] = [];
                merchantGroups.forEach(group => {

                    if (group.type === EMerchantGroupType.CUSTOM
                        || group.type === EMerchantGroupType.SYSTEM) {
                        systemMerchantGroups.push(group);
                    }
                    if (group.selected) {
                        selectedMerchantGroupId = group.id;
                        merchants = group.merchants;
                    }
                });
                this.merchants.set(merchants);
                this.selectedMerchantGroupId.set(selectedMerchantGroupId);
                this.merchantGroups.set(merchantGroups);
                this.systemMerchantGroups.set(systemMerchantGroups);

            });

        this.merchantFilterService.showMerchantGroupType$
            .pipe(takeUntil(this.destroyFlag))
            .subscribe((showMerchantGroupType) => {
                this.showMerchantGroupType.set(showMerchantGroupType);
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
                selected: false,
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

    onSelectSystemGroup(groupId: string) {
        this.merchantFilterService.updateSelectedAddressGroup(groupId);
        this.merchantFilterService.updateShowMerchantGroupType(EShowMerchantGroupType.HISTORY);
    }
    onRemoveMerchantFromGroup(event: MouseEvent, listId: string, merchantId: string) {
        event.stopPropagation();
        this.merchantFilterService.removeFromGroup(listId, merchantId);
    }

    onSelectMerchant(merchant: IMerchant) {
        this.merchantFilterService.updateSelectedMerchant(merchant);
    }

    onSelectMerchantGroup(groupId: string) {
        this.merchantFilterService.selectMerchantGroup(groupId);
        this.selectedMerchantGroupId.set(groupId);

        if (groupId === 'ALL') {
            const merchants = this.merchantGroups().map(group => group.merchants).flat();
            this.merchants.set(merchants);
        }
    }


}
