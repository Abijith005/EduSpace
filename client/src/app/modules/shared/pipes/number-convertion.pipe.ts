import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberConvertion',
})
export class NumberConvertionPipe implements PipeTransform {
  transform(value: number): string {
    if (value >= 1000) {
      return `${Math.floor(value / 1000)} k+`;
    }
    return value.toString();
  }
}
