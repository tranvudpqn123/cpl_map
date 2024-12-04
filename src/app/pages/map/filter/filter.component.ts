import {ChangeDetectionStrategy, Component, inject, input, output, signal} from '@angular/core';
import {merchants as merchantsData, serviceTypes as serviceTypesData} from './../data';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {IMerchant, IMerchantRequest} from '@models/merchant-request.interface';


@Component({
    selector: 'app-filter',
    standalone: true,
    imports: [
        ReactiveFormsModule
    ],
    templateUrl: './filter.component.html',
    styleUrl: './filter.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterComponent {
    search = output<IMerchantRequest>();
    selectMerchant = output<IMerchant>();
    merchants = input<any[]>();

    private readonly fb = inject(FormBuilder);
    readonly pageSizeOptions = [20, 50, 100, 1000]
    serviceTypes = signal(serviceTypesData);
    searchForm = this.fb.group({
        keySearch: [''],
        serviceTypeId: [''],
        sortBy: [''],
        pageSize: [-1]
    });

    onSearch() {
        const {keySearch, sortBy, serviceTypeId, pageSize} = this.searchForm.value;

        const request: IMerchantRequest = {
            keySearch: keySearch || '',
            serviceTypeId: serviceTypeId || '',
            sortBy: sortBy == 'BILL_AMOUNT' ? 'BILL_AMOUNT' : 'BILL_COUNT',
            pageSize: pageSize && pageSize !== -1 ? pageSize : 10000
        }
        this.search.emit(request);
    }

    onSelectMerchant(merchant: IMerchant) {
        this.selectMerchant.emit(merchant);
    }
}
