import {AfterViewInit, ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, signal} from '@angular/core';
import {Swiper} from 'swiper';
import {RedZoomModule} from 'ngx-red-zoom';

@Component({
    selector: 'app-slider-photos',
    standalone: true,
    templateUrl: './slider-photos.component.html',
    styleUrl: './slider-photos.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RedZoomModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SliderPhotosComponent implements AfterViewInit {
    photos = signal([
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
    ])

    ngAfterViewInit() {
        new Swiper("#btnPhotoGroups", {
            slidesPerView: "auto",
            spaceBetween: 4,
            mousewheel: true
        });

        new Swiper("#photoSliderWrapper", {
            slidesPerView: 1,
            pagination: true,
            spaceBetween: 0,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },

        });
    }
}
