import {Directive, ElementRef, EventEmitter, HostListener, inject, Output} from '@angular/core';

@Directive({
    selector: '[appClickOutside]',
    standalone: true
})
export class ClickOutsideDirective {
    @Output() clickOutside = new EventEmitter<void>();
    private readonly elementRef = inject(ElementRef);

    @HostListener('document:click', ['$event.target'])
    onClick(targetElement: HTMLElement): void {
        const clickedInside = this.elementRef.nativeElement.contains(targetElement);
        if (!clickedInside) {
            this.clickOutside.emit();
        }
    }

}
