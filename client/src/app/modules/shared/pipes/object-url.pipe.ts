import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectUrl'
})
export class ObjectUrlPipe implements PipeTransform {

  transform(file: File): string {
    return URL.createObjectURL(file);
  }

}
