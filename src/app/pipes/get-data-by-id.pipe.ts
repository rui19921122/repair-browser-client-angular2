import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'getDataById'
})
export class GetDataByIdPipe implements PipeTransform {

  transform(value: { id: string }[], id: string): any {
    console.log('checked');
    if (value && value.length > 0) {
      return value.find(value2 => value2.id === id);
    }
    return null;
  }

}
