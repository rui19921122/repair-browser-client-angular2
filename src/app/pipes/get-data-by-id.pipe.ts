import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'getDataById'
})
export class GetDataByIdPipe implements PipeTransform {

  transform(value: { id: string }[], id: string): any {
    return value.find(value2 => value2.id === id);
  }

}
