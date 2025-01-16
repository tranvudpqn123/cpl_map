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
import {EAddressGroupType, IListAddress, MerchantFilterService} from '@services/merchant-filter.service';
import {takeUntil} from 'rxjs';
import {IconPaths} from '@constants/image-paths';
import {SafeSvgPipe} from '@pipes/safe-svg.pipe';
import {Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay';
import {CdkPortal, PortalModule, TemplatePortal} from '@angular/cdk/portal';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Browser} from 'leaflet';
import {IMerchant} from '@models/merchant.interface';

@Component({
    selector: 'app-personal-groups',
    standalone: true,
    imports: [
        CommonModule,
        SafeSvgPipe,
        PortalModule,
        FormsModule
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

    selectedList = signal<IListAddress | null>(null);
    selectedMerchant = signal<IMerchant | null>(null);
    selectedGroupType = signal<EAddressGroupType | null>(EAddressGroupType.SAVED);
    listAddress = signal<IListAddress[]>([]);
    openAddListForm = signal(false);
    newListName = '';


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
        this.merchantFilterService.selectedListAddress$
            .pipe(takeUntil(this.destroyFlag))
            .subscribe((selectedList) => {
                this.selectedList.set(selectedList);
            });
        this.merchantFilterService.selectedMerchant$
            .pipe(takeUntil(this.destroyFlag))
            .subscribe((selectedMerchant) => {
                this.selectedMerchant.set(selectedMerchant);
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
        this.overlayRef.backdropClick().subscribe(() => this.onCloseCreateListForm());

        const inputElm = document.querySelector('.form-add-new-list .form-control') as HTMLElement;
        if (inputElm) {
            inputElm.focus();
        }
    }

    onOpenContextMenu(selectedList: IListAddress, event: MouseEvent) {
        event.stopPropagation();
        if (this.overlayRef) {
            this.overlayRef.dispose();
        }

        const currentTarget = event.currentTarget as HTMLElement;
        if (currentTarget) {
            const currentElement = currentTarget.getBoundingClientRect();
            this.selectedList.set(selectedList);

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

    onSaveList() {
        if (this.newListName && this.overlayRef) {
            const id = this.selectedList()?.id || '';
            this.merchantFilterService.createOrUpdateListAddress({
                id,
                title: this.newListName,
                default: false,
                icon: IconPaths.LIST_BULLETED_LG,
                merchants: []
            });
            this.onCloseCreateListForm();
        };
    }

    onRemoveList() {
        const selectedList = this.selectedList();;
        if (selectedList) {
            this.merchantFilterService.removeListAddress(selectedList.id);
            this.overlayRef?.detach();
        }
    }

    onEditList() {
        const selectedList = this.selectedList();;
        if (selectedList) {
            this.newListName = selectedList.title;
            this.overlayRef?.detach();
            this.onOpenAddListForm();
        }
    }

    onCloseCreateListForm() {
        if (this.overlayRef) {
            this.overlayRef.detach();
            this.newListName = '';
        }
    }

    onSelectList(list: IListAddress) {
        this.merchantFilterService.selectListAddress(list.id);
    }

    onMerchantFromGroup(event: MouseEvent, listId: string, merchantId: string) {
        event.stopPropagation();
        this.merchantFilterService.removeFromList(listId, merchantId);
    }

    onSelectMerchant(merchant: IMerchant) {
        this.merchantFilterService.updateSelectedMerchant(merchant);
    }
}
