import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    OnInit,
    output,
    Output,
    signal
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Swiper} from 'swiper';
// Components
import {AddressReviewsComponent} from '@pages/map/address-reviews/address-reviews.component';
import {ProductsComponent} from '@pages/map/products/products.component';
// Services
import {IMerchant} from '@models/merchant.interface';
// Directives
import {StarRatingDirective} from 'directives/star-rating.directive';
import {ScrollDirectionDirective} from 'directives/scroll-directive.directive';
import {MerchantFilterService} from '@services/merchant-filter.service';
import {EAddressDetailTab} from '@models/address-merchant.interface';

@Component({
    selector: 'app-address-detail',
    standalone: true,
    imports: [
        CommonModule,
        // Directives
        StarRatingDirective,
        ScrollDirectionDirective,
        // Components
        AddressReviewsComponent,
        ProductsComponent,
    ],
    templateUrl: './address-detail.component.html',
    styleUrl: './address-detail.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressDetailComponent implements OnInit, AfterViewInit {
    changeTab = output<EAddressDetailTab>()
    isShowMerchantGroups = input();
    selectedMerchant = input<IMerchant | null>();
    timeUntilClose: string | null = null;
    readonly EAddressDetailTab = EAddressDetailTab;
    imageGroups = signal([
        'https://s3.ap-southeast-1.amazonaws.com/mytourcdn.com/resources/pictures/hotels/17/zm0h0Jr-Ti2eyZbrH5VM3A-77.jpeg',
        'https://s3.ap-southeast-1.amazonaws.com/mytourcdn.com/resources/pictures/hotels/17/kIAtLS5rRK6w6g1wdGuaBg-64.jpeg',
        'https://s3.ap-southeast-1.amazonaws.com/mytourcdn.com/resources/pictures/hotels/17/qWXS4-zBRG6c23T5XLjCag-161.jpeg',
        'https://s3.ap-southeast-1.amazonaws.com/mytourcdn.com/resources/pictures/hotels/17/gFD_RrUzRryUiHntS3GzkA-167.jpeg',
        'https://s3.ap-southeast-1.amazonaws.com/mytourcdn.com/resources/pictures/hotels/17/gFD_RrUzRryUiHntS3GzkA-168.jpeg'
    ]);
    isAtTop = signal(true);
    currentTab = signal(EAddressDetailTab.OVERVIEW);

    ngOnInit() {
        this.calculateTimeUntilClose();
    }

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

    calculateTimeUntilClose() {
        const currentTime = new Date();
        const endHourString = this.selectedMerchant()!.workingTimes[0].endHour;

        if (endHourString) {
            const [endHour, endMinute,endSecond] = endHourString.split(':').map(Number);
            const closingTime = new Date();
            closingTime.setHours(endHour, endMinute, endSecond);
            // const  closingTime = new Date('Mon Jan 13 2025 15:00:00 GMT+0700 (Giờ Đông Dương)')
            const timeDifference = closingTime.getTime() - currentTime.getTime();
            if (timeDifference > 0) {
                const hours = Math.floor(timeDifference / (1000 * 60 * 60));
                const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
                if(hours === 0){
                    this.timeUntilClose = `${minutes} phút`;
                }
            } else {
                this.timeUntilClose = 'Đã đóng cửa';
            }
        }
    }
}
