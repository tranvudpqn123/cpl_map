import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dotSeparator',
  standalone: true
})
export class DotSeparatorPipe implements PipeTransform {

  transform(value: string | number | null): string {
    // Return empty string if the value is null, undefined, or empty
  if (value == null || value === '') return '';

  // Convert value to a number
  const numericValue = Number(value);

  // Return empty string if the converted value is NaN
  if (isNaN(numericValue)) {
    return '';
  }

  // Format the number with dots as the thousands separator
  return new Intl.NumberFormat('de-DE').format(numericValue);
  }

}
