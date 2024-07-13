import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeTimestamp'
})
export class RemoveTimestampPipe implements PipeTransform {

  transform(value: string,): string {
    return value.replace(/^\d+-/, '');
  }

}
