import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'split_long_sentence_with_colon'
})
export class SplitLongSentenceWithColon implements PipeTransform {

    transform(value: string, args: number = 9): string {
        const spited = value.split(':');
        if (spited.length === 1) {
            return spited[0].slice(0, args);
        } else {
            return spited[0];
        }
    }

}
