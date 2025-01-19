import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
})
export class DurationPipe implements PipeTransform {
  transform(value: number): string {
    if (isNaN(value) || value < 0) {
      return '0hr 0m 0s';
    }

    value = Math.floor(value);

    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const seconds = value % 60;

    const formatted = `${hours}hr ${minutes}m ${seconds}s`;

    return formatted;
  }
}
