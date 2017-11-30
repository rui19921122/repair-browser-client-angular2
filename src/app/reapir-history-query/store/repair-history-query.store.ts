///<reference path="../api.ts"/>
import {Action} from '@ngrx/store';
import * as moment from 'moment';
import {} from '../api';
import {
  sort_data_by_date,
  add_a_value_to_sorted_object,
  generate_a_id,
  string_is_a_valid_time_range
} from '../../util_func';

export interface RepairHistoryQueryDetailDataInterface {
  number: string;
  plan_start_time: moment.Moment;
  actual_start_time: moment.Moment;
  plan_end_time: string;
  actual_end_time: string;
  canceled: boolean;
  manual: boolean;
  repair_type: string;
  actual_start_number: string;
  actual_end_number: string;
  person: string;
  date: moment.Moment;
  department: string;
}

export interface RepairHistoryQueryWholeDayDetailDataInterface {
  date: string;
  contents: RepairHistoryQueryDetailDataInterface[]; // date string 的格式为YYYY-MM-DD
}

export interface RepairHistoryQueryStoreInterface {
  repair_data: RepairHistoryQueryWholeDayDetailDataInterface[];
  start_time: moment.Moment;
  end_time: moment.Moment;
}

export const UPDATE_ALL_REPAIR_DATA = '[repair-history-query]UPDATE_ALL_REPAIR_DATA';

// 更新store里的历史数据
export class UpdateAllRepairData implements Action {
  readonly type = UPDATE_ALL_REPAIR_DATA;

  constructor(public payload: { data: RepairHistoryQueryWholeDayDetailDataInterface[] }) {

  }
}


export type RepairHistoryQueryStoreActionType = UpdateAllRepairData; // 复制此行到ActionType中,更新store里的历史数据 action type

export const RepairHistoryQueryStoreActions = {
  UpdateAllRepairData,  // 复制此行到导出的Action中,更新store里的历史数据 actions
};


const default_state: RepairHistoryQueryStoreInterface = {
  repair_data: [],
  start_time: moment(),
  end_time: moment()
};


export function reducer(state: RepairHistoryQueryStoreInterface = default_state,
                        action: RepairHistoryQueryStoreActionType): RepairHistoryQueryStoreInterface {
  switch (action.type) {
    case
    UPDATE_ALL_REPAIR_DATA:
      return {...state, repair_data: action.payload.data}; // 复制此两行到reducer中,更新store里的历史数据 reducer
    default:
      return state;
  }
}

export default reducer;
