import {ChangeDetectionStrategy, Component, inject, Input, OnInit, signal} from '@angular/core';
import { NgStyle} from '@angular/common';
import {StarRatingDirective} from 'directives/star-rating.directive';
import {ReviewService} from '@services/review.service';

@Component({
    selector: 'app-address-reviews',
    standalone: true,
    imports: [
        NgStyle,
        StarRatingDirective,

    ],
    templateUrl: './address-reviews.component.html',
    styleUrl: './address-reviews.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressReviewsComponent implements OnInit {
    @Input() merchantId!: string | undefined;
    private readonly reviewService = inject(ReviewService)
    listRatings = signal<any>([])


    ngOnInit() {
        this.reviewService.getRating(this.merchantId).subscribe(res => {
            const {data, code } = res;
            if(code === '200'){
                this.listRatings.set(data)
            }
        })
    }
}
