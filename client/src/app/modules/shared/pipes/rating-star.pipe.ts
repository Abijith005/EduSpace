import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ratingStar',
})
export class RatingStarPipe implements PipeTransform {
  transform(value: number): number[] {
    let result = [];
    for (let i = 1; i <= 5; i++) {
      if (value >= i) {
        result.push(1);
      } else if (value < i && value > i - 1) {
        result.push(0.5);
      } else {
        result.push(0);
      }
    }

    return result;
  }
}
