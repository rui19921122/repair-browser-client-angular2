import {RepairPlanAndHistoryDataSorted} from './repair-history-collect/repair-history-collect.store';
import * as moment from 'moment';
import * as _ from 'lodash';

export function generate_a_id(values: { date?: string | moment.Moment | Date, number: string }): string {
  let date_string: string;
  if (typeof values.date === 'string') {
    date_string = values.date;
  } else if (moment.isMoment(values.date)) {
    date_string = values.date.format('YYYY-MM-DD');
  } else if (Date.isPrototypeOf(values.date)) {
    date_string = moment(values.date).format('YYY-MM-DD');
  }
  return date_string + '-' + values.number;
}

const re_range = /^(\d{1,2}:\d{1,2})\-(\d{1,2}:\d{1,2})/;
const re_time = /^(\d{1,2}):(\d{1,2})/;

export function string_is_a_valid_time_range(string: string) {
  return string.match(re_range);
}

export function string_is_a_valid_time(string: string) {
  return string.match(re_time);
}

export function sort_data_by_date(data: RepairPlanAndHistoryDataSorted[]): RepairPlanAndHistoryDataSorted[] {
  return data.sort((a, b) => a.date.isSameOrBefore(b.date) ? -1 : 1);
}

export function add_a_value_to_sorted_object(date: moment.Moment | string | Date,
                                             origin: RepairPlanAndHistoryDataSorted[],
                                             value: string,
                                             type: 'plan' | 'history') {
  let index = origin.findIndex(value2 => value2.date.isSame(date));
  if (index < 0) {
    let splice_index = 0; // 设置插入新日期的位置
    if (origin.length === 0 || origin[origin.length - 1].date.isBefore(date)) {
      origin.push({
          date: moment(date),
          repair_history_data_index_on_this_day: [],
          repair_plan_data_index_on_this_day: [],
          repair_history_data_not_map_in_plan: []
        }
      );
      splice_index = origin.length - 1;
    } else {
      for (const i of origin) {
        if (i.date.isAfter(date)) {
          origin.splice(splice_index, 0, {
            date: moment(date),
            repair_history_data_index_on_this_day: [],
            repair_plan_data_index_on_this_day: [],
            repair_history_data_not_map_in_plan: []
          });
          break;
        }
        splice_index += 1;
      }
    }
    index = splice_index;
    // 将index设为新增的最后一个日期
  }

  if (type === 'plan') {
    origin[index].repair_plan_data_index_on_this_day.push({plan_number_id: value, is_manual: false, history_number_id: null});
  } else {
    origin[index].repair_history_data_index_on_this_day.push(value);
  }
}

export function end_time_should_later_than_start_time(start: string, end: string): boolean {
  if (start && end) {
    const start_moment = moment().hours(Number(start.split(':')[0])).minutes(Number(start.split(':')[1]));
    const end_moment = moment().hours(Number(end.split(':')[0])).minutes(Number(end.split(':')[1]));
    return start_moment.isBefore(end_moment);
  } else {
    return false;
  }
}

export function convert_h_mm_time_format_to_hh_mm_time_format(string: string) {
  return string.length === 5 ? string : '0' + string;
}

export function get_csrf_token() {
  const name = 'csrftoken';
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = _.trim(cookies[i]);
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export function convert_a_HH_mm_like_string_to_a_moment(string: string | null, date: moment.Moment): moment.Moment {
  if (string) {
    const match = string_is_a_valid_time(string);
    if (match) {
      return moment(date).hour(Number(match[1])).minute(Number(match[2]));
    } else {
      return null;
    }
  }
  return null;
}

