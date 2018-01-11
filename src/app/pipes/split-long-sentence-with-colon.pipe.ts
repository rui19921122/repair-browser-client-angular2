import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'split_long_sentence_with_colon'
})
export class SplitLongSentenceWithColon implements PipeTransform {

  transform(value: string, args: number = 9): string {
    const spited = value.split(':');
    if (spited.length === 2) {
      return spited[0].slice(0, args);
    } else {
      const spited_by_another_colon = value.split('：');
      if (spited_by_another_colon.length === 2) {
        return spited_by_another_colon[0].slice(0, args);
      } else {
        return value;
      }
    }
  }

}
