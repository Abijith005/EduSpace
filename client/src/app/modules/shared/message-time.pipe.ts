import { Pipe, PipeTransform } from '@angular/core';
import {
  format,
  isToday,
  isYesterday,

} from 'date-fns';

@Pipe({
  name: 'messageTime',
})
export class MessageTimePipe implements PipeTransform {
  transform(date: Date | string): unknown {
    if (!date) return '';
    const inputDate = new Date(date);
    const currentDate = new Date();
    if (isToday(inputDate)) {
      return format(inputDate, 'h:mm a');
    }
    if (isYesterday(inputDate)) {
      return `Yesterday ${format(inputDate, 'h:mm a')}`;
    }
    return format(inputDate, "dd/MM/yyyy  h:mm a");  }
}
