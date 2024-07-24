import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileNameExtractor',
})
export class FileNameExtractorPipe implements PipeTransform {
  transform(filePath: string): string {
    const match = filePath.match(/(?:[^-]+-)([^/]+)$/);
    if (match) {
      return match[1];
    }
    return '';
  }
}
