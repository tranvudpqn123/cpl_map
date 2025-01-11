import {inject, Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Pipe({
  name: 'safeSvg',
  standalone: true
})
export class SafeSvgPipe implements PipeTransform {
    private readonly sanitizer = inject(DomSanitizer);

  transform(svg: string): SafeHtml {
      return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

}
