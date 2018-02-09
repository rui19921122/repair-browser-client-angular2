import {RepairHistoryApiInterface, RepairHistoryDataApiInterface, RepairPlanDataApiInterface} from '../api';
import {
  RepairDataInterface,
  RepairDetailDataStoreInterface, RepairHistoryDataStoreInterface,
  RepairPlanDataStoreInterface
} from './repair-history-collect.store';
import {generate_a_id, string_is_a_valid_time_range} from '../util_func';
import * as moment from 'moment';

export function convert_plan_data_server_to_store(origin: RepairPlanDataApiInterface,
                                                  existed?: RepairDataInterface[]): RepairDataInterface | RepairDataInterface[] {
  const is_a_time = string_is_a_valid_time_range(origin.plan_time);
  let type;
  switch (origin.type) {
    case 'Ⅱ':
      type = '局';
      break;
    case 'Ⅰ':
      type = '局';
      break;
    case '垂':
      type = '垂';
      break;
    case '站':
      type = '站';
      break;
    default:
      type = origin.type;
  }
  const id = generate_a_id(origin);
  const calc_time = !!is_a_time;
  const start_time = calc_time ? moment(is_a_time[1], 'HH:mm') : null;
  const end_time = calc_time ? moment(is_a_time[2], 'HH:mm') : null;
  const longing = calc_time ? end_time.diff(start_time, 'minutes')
    : 0;
  return {
    type: type,
    number: origin.number,
    date: moment(origin.post_date),
    apply_place: origin.apply_place,
    id,
    plan_time: origin.plan_time,
    area: origin.area,
    used_number: `${moment(origin.post_date)
      .format('YYYYMMDD')}-${origin.type === '站' ? 'Z' : (origin.type === '垂' ? 'D' : 'J')}${origin.number}`,
    plan_start_time: start_time,
    plan_longing: longing,
    plan_end_time: end_time,
    plan_calc_time: calc_time,
    canceled: false,
    actual_watcher: null,
    actual_start_time: null,
    actual_start_number: null,
    actual_longing: null,
    actual_end_time: null,
    actual_end_number: null
  };
}

export function convert_history_data_server_to_store(origin: RepairHistoryDataApiInterface): RepairHistoryDataStoreInterface {
  return {
    date: moment(origin.date),
    number: origin.number,
    plan_time: origin.plan_time,
    id: generate_a_id(origin),
    apply_place: origin.apply_place,
    inner_id: origin.inner_id,
    plan_type: origin.plan_type,
    repair_content: origin.repair_content,
    repair_department: origin.repair_department,
    use_paper: origin.use_paper,
    used_number: origin.number,
    cached: 0,
  };

}

export function convert_history_server_data_to_store_data(origin: RepairHistoryDataApiInterface,
                                                          existed: RepairDataInterface[]): RepairDataInterface {
  const id = generate_a_id(origin);
  if (existed && existed.findIndex(value => value.id === id)) {
    return null;
  }
  const number_split = origin.number.split('-');
  const number = number_split[1].slice(1, number_split[1].length);
  let type;
  switch (number_split[1][0]) {
    case 'J':
      type = '局';
      break;
    case 'Z':
      type = '站';
      break;
    case 'D':
      type = '垂';
      break;
    default:
      type = null;
      break;
  }
  const plan_time = origin.plan_time;
  const plan_time_split = plan_time.split('-');
  let plan_calc_time: boolean;
  let plan_start_time: moment.Moment | null = null;
  let plan_end_time: moment.Moment | null = null;
  if (plan_time_split.length === 2) {
    plan_calc_time = true;
    plan_start_time = moment(plan_time_split[0], 'HH:mm');
    plan_end_time = moment(plan_time_split[1], 'HH:mm');
  } else {
    plan_calc_time = false;
  }
  const date = moment(origin.date, 'YYYYMMDD');
  return {
    actual_end_number: null,
    actual_end_time: null,
    actual_longing: null,
    actual_start_number: null,
    actual_start_time: null,
    actual_watcher: null,
    apply_place: origin.apply_place,
    area: origin.apply_place,
    canceled: false,
    date: date,
    id: id,
    number: number,
    plan_calc_time: plan_calc_time,
    plan_end_time: plan_end_time,
    type: type,
    plan_longing: plan_calc_time ? plan_end_time.diff(plan_start_time, 'minutes') : 0,
    plan_start_time: plan_start_time,
    plan_time: origin.plan_time,
    used_number: origin.number
  };
}

export function check_a_plan_history_detail_group_data_is_valid(plan: RepairPlanDataStoreInterface,
                                                                history: RepairHistoryDataStoreInterface,
                                                                detail: RepairDetailDataStoreInterface): {
  valid: boolean, error: string
} {
  if (plan) {
  } else {
    return {valid: false, error: '无计划数据'};
  }
  if (detail) {
  } else {
    return {valid: false, error: `${plan.date.format('YYYY-MM-DD')}编号${plan.number}的天窗修计划缺少详细数据`};
  }
  return {valid: true, error: ''};
}
