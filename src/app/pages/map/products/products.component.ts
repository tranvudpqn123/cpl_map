import {
    ChangeDetectionStrategy,
    Component,
    inject, Input,
    OnInit, AfterViewInit,
    signal
} from '@angular/core';
// Service
import {ProductsService} from '@services/products.service';

import {CommonModule} from '@angular/common';
import {IProduct, IProductGroup} from '@models/product.interface';
import {DotSeparatorPipe} from '@pipes/dot-separator.pipe';
import {Swiper} from 'swiper';

@Component({
    selector: 'app-products',
    standalone: true,
    imports: [CommonModule, DotSeparatorPipe],
    templateUrl: './products.component.html',
    styleUrl: './products.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent implements OnInit, AfterViewInit {

    listProduct = signal<IProduct[]>([]);
    listProductFill = signal<IProduct[]>([]);
    listGroupsProduct = signal<IProductGroup[]>([]);
    selectedImage = signal<IProduct | null>(null);
    selectedGroupId = signal<string | null>(null);
    private readonly productsService = inject(ProductsService);
    @Input() merchantId!: string | undefined;

    ngOnInit(): void {
        this.getListProduct();
        this.getListProductGroups();
    }
    ngAfterViewInit() {
        new Swiper("#btnCategoryProduct", {
            slidesPerView: 3,
            spaceBetween: 16,
            mousewheel: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            }
        });
    }


    getListProduct(){
        this.productsService.getProduct(this.merchantId).subscribe(res => {
            const {data, code} = res;
            if (code === '200' && data) {
                this.listProduct.set(data.data);
            }
        })
    }
    getListProductGroups(){
        this.productsService.getListProductType(this.merchantId).subscribe(res => {
            const {data, code} = res;
            if (code === '200' && data) {
                this.listGroupsProduct.set([...data]);
            }
        })
    }

    selectGroup(id: string): void {
        if (id === this.selectedGroupId()) {
            this.selectedGroupId.set(null);
            return;
        }
        this.selectedGroupId.set(id);
        const listProductFilter: IProduct[] = this.listProduct().filter((i) => (i.productGroupId == this.selectedGroupId()));
        if (listProductFilter) {
            this.listProductFill.set(listProductFilter);
        }
    }


    showDetailImage(data: IProduct): void {
        this.selectedImage.set(data);
    }
}

