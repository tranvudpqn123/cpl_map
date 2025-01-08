import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {IAddressGroup, MerchantFilterService} from '@services/merchant-filter.service';

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
    addressGroups = signal<IAddressGroup[]>([]);

    ngOnInit() {
        this.merchantFilterService.addressGroups$
            .subscribe((addressGroups) => {
                console.log('addressGroups', addressGroups);
                this.addressGroups.set(addressGroups);
            });
    }
}
