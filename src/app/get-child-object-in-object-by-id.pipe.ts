import {Pipe, PipeTransform} from '@angular/core';
import {Observable} from 'rxjs/Observable';

@Pipe({
  name: 'getChildObjectInObjectById'
})
export class GetChildObjectInObjectByIdPipe implements PipeTransform {

  transform(value: Observable<any>, args?: string): Observable<any> {
    return value.map(v => v[args]);
  }

}
