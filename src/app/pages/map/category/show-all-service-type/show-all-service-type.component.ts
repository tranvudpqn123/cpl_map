import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit, signal,
} from '@angular/core';
import {RedZoomModule} from 'ngx-red-zoom';
import {IServiceType, MerchantFilterService} from '@services/merchant-filter.service';
import {CommonModule} from '@angular/common';
import {CategoryService} from '@services/category.service';
import {firstValueFrom, forkJoin} from "rxjs";
import {Dialog} from "@angular/cdk/dialog";
import {IconPaths} from "@constants/image-paths";
import {SafeSvgPipe} from "@pipes/safe-svg.pipe";
import {ISubServiceType} from '@models/category.interface';

@Component({
    selector: 'app-show-service-type',
    standalone: true,
    templateUrl: './show-all-service-type.component.html',
    styleUrl: './show-all-service-type.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RedZoomModule, CommonModule, SafeSvgPipe],
})
export class ShowAllServiceTypeComponent implements OnInit {
    private readonly categoryService = inject(CategoryService);
    private readonly merchantFilterService = inject(MerchantFilterService);
    private readonly dialog = inject(Dialog);

    listServiceTypes = signal<IServiceType[]>([])
    listSubServiceType = signal<ISubServiceType[]>([])

    ngOnInit() {
        this.categoryService.listServiceType.subscribe((data) => {
            this.listServiceTypes.set(data);

            data.forEach((itemServiceType) => {
                this.cacheListSubService(itemServiceType).then();
            });
        });
    }

    onSelectSubServiceType(subService: ISubServiceType) {
        this.merchantFilterService.updateSelectedSubService(subService);
        this.closeModal();
    }

    closeModal(){
        this.dialog.closeAll();
    }

    async cacheListSubService(service: IServiceType) {
        const cachedSubServiceTypes = service.subServiceTypes ?? [];
        if (cachedSubServiceTypes.length > 0) {
            const combinedSubServiceTypes = [
                ...this.listSubServiceType(),
                ...cachedSubServiceTypes.map((item: ISubServiceType) => ({
                    ...item,
                    serviceTypeId: service.id,
                })),
            ];
            this.listSubServiceType.set(combinedSubServiceTypes);
        } else {
            const serviceId = service.id;
            const { code, data } = await firstValueFrom(this.merchantFilterService.getSubServiceTypes(serviceId));

            if (code === '200') {
                this.merchantFilterService.cacheSubServiceTypes(serviceId, data);

                const combinedSubServiceTypes = [
                    ...this.listSubServiceType(),
                    ...data.map((item: ISubServiceType) => ({
                        id: item.id,
                        name: item.name,
                        avatar: item.avatar,
                        serviceTypeId: serviceId,
                    })),
                ];
                this.listSubServiceType.set(combinedSubServiceTypes);
            }
        }
    }




    protected readonly IconPaths = IconPaths;
}
