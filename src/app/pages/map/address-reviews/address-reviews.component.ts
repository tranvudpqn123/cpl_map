import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {NgStyle} from '@angular/common';
import {StarRatingDirective} from 'directives/star-rating.directive';
import {Swiper} from 'swiper';

@Component({
  selector: 'app-address-reviews',
  standalone: true,
    imports: [
        NgStyle,
        StarRatingDirective
    ],
  templateUrl: './address-reviews.component.html',
  styleUrl: './address-reviews.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressReviewsComponent {
    originalImages = signal([
        'https://lh5.googleusercontent.com/p/AF1QipMNtp39M4IIb4uOk5lwZayzEocWzuQfBmxTDyXu=w300-h225-p-k-no',
        'https://lh5.googleusercontent.com/p/AF1QipMk7yGtcVb6DTF7YgQc3LFFc_a2J6r-c9fnB-3R=w300-h225-p-k-no',
        'https://lh5.googleusercontent.com/p/AF1QipMNtp39M4IIb4uOk5lwZayzEocWzuQfBmxTDyXu=w300-h225-p-k-no',
        'https://lh5.googleusercontent.com/p/AF1QipMk7yGtcVb6DTF7YgQc3LFFc_a2J6r-c9fnB-3R=w300-h225-p-k-no',
        'https://lh5.googleusercontent.com/p/AF1QipMNtp39M4IIb4uOk5lwZayzEocWzuQfBmxTDyXu=w300-h225-p-k-no',
        'https://lh5.googleusercontent.com/p/AF1QipMk7yGtcVb6DTF7YgQc3LFFc_a2J6r-c9fnB-3R=w300-h225-p-k-no',
        'https://lh5.googleusercontent.com/p/AF1QipMNtp39M4IIb4uOk5lwZayzEocWzuQfBmxTDyXu=w300-h225-p-k-no',
        'https://lh5.googleusercontent.com/p/AF1QipMk7yGtcVb6DTF7YgQc3LFFc_a2J6r-c9fnB-3R=w300-h225-p-k-no',
        'https://lh5.googleusercontent.com/p/AF1QipMNtp39M4IIb4uOk5lwZayzEocWzuQfBmxTDyXu=w300-h225-p-k-no',
        'https://lh5.googleusercontent.com/p/AF1QipMk7yGtcVb6DTF7YgQc3LFFc_a2J6r-c9fnB-3R=w300-h225-p-k-no',
    ])
    images = signal([
        'https://lh5.googleusercontent.com/p/AF1QipMNtp39M4IIb4uOk5lwZayzEocWzuQfBmxTDyXu=w300-h225-p-k-no',
        'https://lh5.googleusercontent.com/p/AF1QipMk7yGtcVb6DTF7YgQc3LFFc_a2J6r-c9fnB-3R=w300-h225-p-k-no',
        'https://lh5.googleusercontent.com/p/AF1QipMNtp39M4IIb4uOk5lwZayzEocWzuQfBmxTDyXu=w300-h225-p-k-no',
        'https://lh5.googleusercontent.com/p/AF1QipMk7yGtcVb6DTF7YgQc3LFFc_a2J6r-c9fnB-3R=w300-h225-p-k-no'
    ]);
    imageGroups = signal([
        'https://s3.ap-southeast-1.amazonaws.com/mytourcdn.com/resources/pictures/hotels/17/zm0h0Jr-Ti2eyZbrH5VM3A-77.jpeg',
        'https://s3.ap-southeast-1.amazonaws.com/mytourcdn.com/resources/pictures/hotels/17/kIAtLS5rRK6w6g1wdGuaBg-64.jpeg',
        'https://s3.ap-southeast-1.amazonaws.com/mytourcdn.com/resources/pictures/hotels/17/qWXS4-zBRG6c23T5XLjCag-161.jpeg',
        'https://s3.ap-southeast-1.amazonaws.com/mytourcdn.com/resources/pictures/hotels/17/gFD_RrUzRryUiHntS3GzkA-167.jpeg',
        'https://s3.ap-southeast-1.amazonaws.com/mytourcdn.com/resources/pictures/hotels/17/gFD_RrUzRryUiHntS3GzkA-168.jpeg'
    ]);

    onShowMoreImages(imageIndex: number) {
        if (imageIndex !== 3) {
            return;
        }
        this.images.set(this.originalImages());
    }
}
