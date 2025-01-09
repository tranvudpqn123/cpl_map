import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appStarRating]',
    standalone: true
})
export class StarRatingDirective implements OnChanges {
    @Input('appStarRating') rating: number = 0; // Input to set the rating value
    @Input() maxStars: number = 5; // Optional: Default max stars to 5

    constructor(private el: ElementRef, private renderer: Renderer2) {}

    ngOnChanges(): void {
        this.renderStars();
    }

    private renderStars(): void {
        const starContainer = this.el.nativeElement;

        // Clear existing stars
        this.renderer.setProperty(starContainer, 'innerHTML', '');

        // Full stars
        const fullStars = Math.floor(this.rating);
        for (let i = 0; i < fullStars; i++) {
            const star = this.renderer.createElement('i');
            this.renderer.addClass(star, 'bi');
            this.renderer.addClass(star, 'bi-star-fill');
            this.renderer.appendChild(starContainer, star);
        }

        // Half star
        if (this.rating % 1 >= 0.5) {
            const halfStar = this.renderer.createElement('i');
            this.renderer.addClass(halfStar, 'bi');
            this.renderer.addClass(halfStar, 'bi-star-half');
            this.renderer.appendChild(starContainer, halfStar);
        }

        // Empty stars
        const emptyStars = this.maxStars - fullStars - (this.rating % 1 >= 0.5 ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            const emptyStar = this.renderer.createElement('i');
            this.renderer.addClass(emptyStar, 'bi');
            this.renderer.addClass(emptyStar, 'bi-star');
            this.renderer.appendChild(starContainer, emptyStar);
        }
    }
}
