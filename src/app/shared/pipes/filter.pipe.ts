import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appFilter',
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }

    if (!searchText) {
      return items;
    }

    searchText = searchText.toLocaleLowerCase();

    return items.filter((result) => {
      return (
        result.firstName.toLocaleLowerCase().includes(searchText) ||
        result.lastName.toLocaleLowerCase().includes(searchText)
      );
    });
  }
}
