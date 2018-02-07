import {RepairHistoryApiInterface, RepairHistoryDataApiInterface, RepairPlanDataApiInterface} from '../api';
import {
  RepairDetailDataStoreInterface, RepairHistoryDataStoreInterface,
  RepairPlanDataStoreInterface
} from './repair-history-collect.store';
import {generate_a_id, string_is_a_valid_time_range} from '../util_func';
import * as moment from 'moment';

export function convert_plan_data_server_to_store(origin: RepairPlanDataApiInterface): RepairPlanDataStoreInterface {
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
  const start_time = calc_time ? is_a_time[1] : null;
  const end_time = calc_time ? is_a_time[2] : null;
  const longing = calc_time ? moment(end_time, 'HH:mm').diff(moment(start_time, 'HH:mm'), 'minutes')
    : 0;
  return {
    type: type,
    number: origin.number,
    date: moment(origin.post_date),
    apply_place: origin.apply_place,
    id,
    calc_time,
    start_time,
    end_time,
    plan_time: origin.plan_time,
    area: origin.area,
    longing,
    used_number: `${moment(origin.post_date)
      .format('YYYYMMDD')}-${origin.type === '站' ? 'Z' : (origin.type === '垂' ? 'D' : 'J')}${origin.number}`
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
