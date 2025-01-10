import {AfterViewInit, ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StarRatingDirective} from 'directives/star-rating.directive';
import {ScrollDirectionDirective} from 'directives/scroll-directive.directive';
import {Swiper} from 'swiper';
import {AddressReviewsComponent} from '@pages/map/address-reviews/address-reviews.component';
import {ProductsComponent} from '@pages/map/products/products.component';

@Component({
    selector: 'app-address-detail',
    standalone: true,
    imports: [CommonModule, StarRatingDirective, ScrollDirectionDirective, AddressReviewsComponent, ProductsComponent],
    templateUrl: './address-detail.component.html',
    styleUrl: './address-detail.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressDetailComponent implements AfterViewInit{
    protected readonly EAddressDetailTab = EAddressDetailTab;
    imageGroups = signal([
        'https://s3.ap-southeast-1.amazonaws.com/mytourcdn.com/resources/pictures/hotels/17/zm0h0Jr-Ti2eyZbrH5VM3A-77.jpeg',
        'https://s3.ap-southeast-1.amazonaws.com/mytourcdn.com/resources/pictures/hotels/17/kIAtLS5rRK6w6g1wdGuaBg-64.jpeg',
        'https://s3.ap-southeast-1.amazonaws.com/mytourcdn.com/resources/pictures/hotels/17/qWXS4-zBRG6c23T5XLjCag-161.jpeg',
        'https://s3.ap-southeast-1.amazonaws.com/mytourcdn.com/resources/pictures/hotels/17/gFD_RrUzRryUiHntS3GzkA-167.jpeg',
        'https://s3.ap-southeast-1.amazonaws.com/mytourcdn.com/resources/pictures/hotels/17/gFD_RrUzRryUiHntS3GzkA-168.jpeg'
    ]);
    isAtTop = signal(true);
    currentTab = signal(EAddressDetailTab.PRODUCT);

    ngAfterViewInit() {
        new Swiper("#btnPhotoGroups", {
            slidesPerView: "auto",
            spaceBetween: 4,
            mousewheel: true,
            pagination: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    }

    onScrollToTop() {
        this.isAtTop.set(true);
    }

    onSelectTab(addressDetailTab: EAddressDetailTab) {
        this.currentTab.set(addressDetailTab);
    }
}

export enum EAddressDetailTab {
    'OVERVIEW' = 'OVERVIEW',
    'REVIEW' = 'REVIEW',
    'ABOUT' = 'ABOUT',
    'PRODUCT' = 'PRODUCT'
}
