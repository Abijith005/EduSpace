import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectUrl',
})
export class ObjectUrlPipe implements PipeTransform {

  transform(value: File | { url: string, key: string }): string {
    if ('url' in value) {
      return value.url;
    } else if (value instanceof File) {
      return URL.createObjectURL(value);
    } else {
      return '';
    }
  }
}
