import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'getDataById'
})
export class GetDataByIdPipe implements PipeTransform {

  transform(value: { id: number }[], args: number): any {
    return value.find(value2 => value2.id === args);
  }

}
