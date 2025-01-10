import {
    Directive,
    ElementRef,
    EventEmitter,
    HostListener,
    Output
} from '@angular/core';

@Directive({
    selector: '[appScrollDirection]',
    standalone: true,
})
export class ScrollDirectionDirective {
    private lastScrollTop = 0; // Keeps track of the last scroll position

    // Emit events for scroll direction
    @Output() scrolling = new EventEmitter<void>();
    @Output() scrolledUp = new EventEmitter<void>();
    @Output() scrolledDown = new EventEmitter<void>();
    @Output() scrolledToTop = new EventEmitter<void>();
    @Output() scrolledToBottom = new EventEmitter<void>();

    constructor(private el: ElementRef) {}

    @HostListener('scroll', ['$event'])
    onScroll(event: Event): void {
        const target = event.target as HTMLElement;
        const currentScrollTop = target.scrollTop;
        const maxScroll = target.scrollHeight - target.clientHeight;

        // Emit event if scrolled to top
        if (currentScrollTop === 0) {
            this.scrolledToTop.emit();
            return;
        }

        // Emit event if scrolled to bottom
        if (currentScrollTop === maxScroll) {
            this.scrolledToBottom.emit();
        }

        // Emit events for scrolling up or down
        if (currentScrollTop > this.lastScrollTop) {
            this.scrolledDown.emit();
        } else if (currentScrollTop < this.lastScrollTop) {
            this.scrolledUp.emit();
        }

        this.scrolling.emit();
        this.lastScrollTop = currentScrollTop; // Update the last scroll position
    }
}
