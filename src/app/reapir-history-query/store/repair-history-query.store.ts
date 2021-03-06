///<reference path="../api.ts"/>
import {Action} from '@ngrx/store';
import * as moment from 'moment';
import {} from '../api';
import {
  sort_data_by_date,
  generate_a_id,
  string_is_a_valid_time_range
} from '../../util_func';

export interface RepairHistoryQueryDetailDataInterface {
  number: string;
  plan_start_time: moment.Moment;
  actual_start_time: moment.Moment;
  plan_end_time: moment.Moment;
  actual_end_time: moment.Moment;
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
  date: string; // date string 的格式为YYYY-MM-DD
  contents: number[];
}

export interface RepairHistoryQueryStoreInterface {
  repair_data_list: RepairHistoryQueryDetailDataInterface[];
  sorted_by_date: RepairHistoryQueryWholeDayDetailDataInterface[];
  start_time: moment.Moment;
  end_time: moment.Moment;
}

export const UPDATE_ALL_REPAIR_DATA = '[repair-history-query]UPDATE_ALL_REPAIR_DATA';

// 更新store里的历史数据
export class UpdateAllRepairData implements Action {
  readonly type = UPDATE_ALL_REPAIR_DATA;

  constructor(public payload: {
    data: {
      contents: RepairHistoryQueryDetailDataInterface[],
      sorted_by_date: RepairHistoryQueryWholeDayDetailDataInterface[]
    }
  }) {

  }
}

export const UPDATE_HEADER_FORM_START_AND_END_DATE = '[repair-history-query]UPDATE_HEADER_FORM_START_AND_END_DATE';

// 更新选择的开始日期和结束日期
export class UpdateHeaderFormStartAndEndDate implements Action {
  readonly type = UPDATE_HEADER_FORM_START_AND_END_DATE;

  constructor(public payload: { start: Date, end: Date }) {

  }
}


export type RepairHistoryQueryStoreActionType = UpdateAllRepairData // 复制此行到ActionType中,更新store里的历史数据 action type
  | UpdateHeaderFormStartAndEndDate // 复制此行到ActionType中,更新选择的开始日期和结束日期 action type
  ;

export const RepairHistoryQueryStoreActions = {
  UpdateAllRepairData,  // 复制此行到导出的Action中,更新store里的历史数据 actions
  UpdateHeaderFormStartAndEndDate,  // 复制此行到导出的Action中,更新选择的开始日期和结束日期 actions
};


const default_state: RepairHistoryQueryStoreInterface = {
  repair_data_list: [],
  start_time: moment(),
  end_time: moment(),
  sorted_by_date: [],
};


export function reducer(state: RepairHistoryQueryStoreInterface = default_state,
                        action: RepairHistoryQueryStoreActionType): RepairHistoryQueryStoreInterface {
  switch (action.type) {
    case
    UPDATE_ALL_REPAIR_DATA:
      return {
        ...state,
        repair_data_list: action.payload.data.contents,
        sorted_by_date: action.payload.data.sorted_by_date
      }; // 复制此两行到reducer中,更新store里的历史数据 reducer
    case
    UPDATE_HEADER_FORM_START_AND_END_DATE:
      return {
        ...state,
        start_time: moment(action.payload.start),
        end_time: moment(action.payload.end)
      }; // 复制此两行到reducer中,更新选择的开始日期和结束日期 reducer
    default:
      return state;
  }
}

export default reducer;
