import { Pipe, PipeTransform } from '@angular/core';
import { format, isToday, isYesterday } from 'date-fns';

@Pipe({
  name: 'messageDate',
})
export class MessageDatePipe implements PipeTransform {
  transform(value: Date | string): string {
    if (!value) return '';
    const inputDate = new Date(value);
    if (isToday(inputDate)) {
      return format(inputDate, 'hh:mm a');
    }

    if (isYesterday(inputDate)) {
      return 'Yesterday';
    }


    return format(inputDate,'dd:MM:yy');
  }
}
