import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'getDataById'
})
export class GetDataByIdPipe implements PipeTransform {

  transform(): any {
  }

}
