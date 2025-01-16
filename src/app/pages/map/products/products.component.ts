import {
    ChangeDetectionStrategy,
    Component,
    inject, Input,
    OnInit,
    signal
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IProduct, IProductGroup} from '@models/product.interface';
import {DotSeparatorPipe} from '@pipes/dot-separator.pipe';
import {ProductsService} from '@services/products.service';

@Component({
    selector: 'app-products',
    standalone: true,
    imports: [CommonModule, DotSeparatorPipe],
    templateUrl: './products.component.html',
    styleUrl: './products.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent implements OnInit {
    originalImages = signal([
        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/472445WTa/mat-tien-b0010979.jpg',
        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455210yCJcAm/cmv-welcom-center_interior-12.jpg',
        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455210EfqeBv/cmv-welcome-center_exterior_10.jpg',
        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455210mtrWxM/cmv-pool-33.jpg',
        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455210UGLXZg/cmv-pool-29.jpg',
        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211TgJMHE/faro-tower-1.jpg',
        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211UzwjzQ/cmv-mundo-restaurant-4.jpg',
        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211JeyMiR/cmv-mundo-restaurant-6.jpg',
        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211Xktjjr/cmv-mundo-restaurant-7.jpg',
        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211MbnTyc/cmv-mundo-restaurant-2.jpg',
        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211vPzGaB/cmv-el-salon-bar-2.jpg',
        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211MwbqAv/cmv-el-salon-bar-3.jpg',
        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211myYXiA/cmv-el-salon-bar-4.jpg',
        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211TVYCWA/cmv-el-salon-bar-6.jpg',
        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211xHNkrZ/cmv-el-salon-bar-5.jpg',
        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211zujUUh/cmv-kid-playground-5.jpg',
        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211MnbdTM/cmv-kid-playground-4.jpg',
        'https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://gcs.tripi.vn/hms_prod/photo/img/455211AtUwtE/cmv-kid-playground-9.jpg'
    ]);

    listProduct = signal<IProduct[]>([]);
    listGroupsProduct = signal<IProductGroup[]>([]);
    showFullImage = signal('')
    selectedImage = signal<IProduct | null>(null);
    private readonly productsService = inject(ProductsService);
    @Input() merchantId!: string | undefined;

    ngOnInit(): void {
        const id = this.merchantId
        this.productsService.getProduct(id).subscribe(res => {
            const {data, code} = res;
            if(code === '200' && data){
                this.listProduct.set(data.data);
            }
        })
        this.productsService.getListProductType(id).subscribe(res => {
            const {data, code} = res;
            if(code === '200' && data){
                this.listGroupsProduct.set(data);
                console.log(this.listGroupsProduct());
            }
        })
    }


    showDetailImage(data: IProduct): void {
        this.selectedImage.set(data);
    }
}

