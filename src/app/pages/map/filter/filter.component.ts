import {ChangeDetectionStrategy, Component, inject, input, output, signal} from '@angular/core';
import {merchants as merchantsData, serviceTypes as serviceTypesData} from './../data';
import {FormBuilder, FormControl, ReactiveFormsModule} from '@angular/forms';
import {ESortType, IMerchant, IMerchantRequest, IServiceType} from '@models/merchant-request.interface';
import {OverlayModule} from '@angular/cdk/overlay';
import {CommonModule} from '@angular/common';
import {DotSeparatorPipe} from '@pipes/dot-separator.pipe';

@Component({
    selector: 'app-filter',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        OverlayModule,
        CommonModule,
        DotSeparatorPipe
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
    protected readonly ESortType = ESortType;
    readonly pageSizeOptions = [20, 50, 100, 1000]
    serviceTypes = signal(serviceTypesData);
    searchForm = this.fb.group({
        keySearch: [''],
        serviceTypeId: [''],
        sortBy: [ESortType.TOTAL_BILL],
        pageSize: [-1]
    });
    isShowServiceTypeOptions = false;
    selectedServiceType = signal<IServiceType | null>(null);
    showSideBar = signal(true);

    get sortBy(): FormControl {
        return this.searchForm.get('sortBy') as FormControl;
    }


    onSearch() {
        let {keySearch, sortBy, serviceTypeId, pageSize} = this.searchForm.value;
        sortBy = sortBy ? sortBy : ESortType.TOTAL_BILL_IN_MONTH;

        const request: IMerchantRequest = {
            keySearch: keySearch || '',
            serviceTypeId: serviceTypeId || '',
            sortBy: sortBy as ESortType,
            pageSize: pageSize && pageSize.toString() !== '-1' ? pageSize : 10000
        }
        this.search.emit(request);
    }

    onSelectMerchant(merchant: IMerchant) {
        this.selectMerchant.emit(merchant);
    }

    onSelectServiceType(serviceType: IServiceType | null) {
        this.isShowServiceTypeOptions = false;
        this.selectedServiceType.set(serviceType);
        this.searchForm.patchValue({
            serviceTypeId: serviceType?.id ?? ''
        });
    }

    onToggleShowSideBar() {
        this.showSideBar.update(val => !val);
    }

    getAmount(merchant: IMerchant) {
        const sortBy = this.sortBy.value;
        if (sortBy === ESortType.TOTAL_BILL) return merchant.total_bill;
        if (sortBy === ESortType.TOTAL_BILL_AMOUNT) return merchant.total_bill_amount;
        if (sortBy === ESortType.TOTAL_BILL_IN_MONTH) return merchant.total_bill_in_month;
        if (sortBy === ESortType.TOTAL_BILL_AMOUNT_IN_MONTH) return merchant.total_bill_amount_in_month;
        return '';
    }
}
