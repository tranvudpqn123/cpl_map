import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    CUSTOM_ELEMENTS_SCHEMA,
    inject,
    OnInit,
    signal
} from '@angular/core';
import {Swiper} from 'swiper';
import {RedZoomModule} from 'ngx-red-zoom';
import {IAddress, IAddressGroup, IAddressImageGroup} from '@models/address-merchant.interface';
import {MerchantFilterService} from '@services/merchant-filter.service';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-slider-photos',
    standalone: true,
    templateUrl: './slider-photos.component.html',
    styleUrl: './slider-photos.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RedZoomModule, CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SliderPhotosComponent implements AfterViewInit, OnInit {
    private readonly merchantFilterService = inject(MerchantFilterService);
    selectedAddress = signal<IAddress | null>(null);
    selectedImageGroup = signal<IAddressImageGroup | null>(null);
    showingImageIdx = signal(0);
    photoSliderWrapperHorizontal: Swiper | null = null;
    photoSliderWrapperVertical: Swiper | null = null;

    ngOnInit() {
        this.merchantFilterService.selectedAddress$
            .subscribe((selectedAddress) => {
                this.selectedAddress.set(selectedAddress);
                this.selectedImageGroup.set(selectedAddress ? selectedAddress.imageGroups[0] : null);
            });
    }

    ngAfterViewInit() {
        new Swiper("#btnPhotoGroups", {
            slidesPerView: "auto",
            spaceBetween: 4,
            mousewheel: true
        });
        this.photoSliderWrapperHorizontal = new Swiper("#photoSliderWrapperHorizontal", {
            slidesPerView: 1,
            pagination: true,
            loop: false,
            spaceBetween: 0,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
        this.photoSliderWrapperHorizontal.on('slideChange', (event: Swiper) => {
            this.showingImageIdx.set(event.activeIndex);
            if (this.photoSliderWrapperVertical) {
                this.photoSliderWrapperVertical.slideTo(event.activeIndex, 500);
            }
        });


        this.photoSliderWrapperVertical = new Swiper("#photoSliderWrapperVertical", {
            slidesPerView: "auto",
            direction: "vertical",
            mousewheel: true,
            spaceBetween: 2,
            pagination: {
                clickable: true,
            },
            loop: false,
            centeredSlides: true,
            centeredSlidesBounds: true,
            scrollbar: {
                el: '.swiper-scrollbar',
                draggable: true,
            },
        });
    }

    onSlideImageTo(index: number) {
        if (this.photoSliderWrapperHorizontal) {
            this.photoSliderWrapperHorizontal.slideTo(index, 500);
            this.showingImageIdx.set(index)
        }
    }

    onSelectImageGroup(imageGroup: IAddressImageGroup) {
        this.selectedImageGroup.set(imageGroup);
        setTimeout(() => {
            if (this.photoSliderWrapperHorizontal) {
                this.photoSliderWrapperHorizontal.update(); // Recalculate slides
                this.photoSliderWrapperHorizontal.slideTo(0); // Reset to the first image
            }
            if (this.photoSliderWrapperVertical) {
                this.photoSliderWrapperVertical.update(); // Recalculate slides
                this.photoSliderWrapperVertical.slideTo(0); // Reset to the first image
            }
        }, 0);

        this.showingImageIdx.set(0);

    }
}
