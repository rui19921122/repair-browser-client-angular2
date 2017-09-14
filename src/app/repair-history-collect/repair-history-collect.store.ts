///<reference path="../api.ts"/>
import {Action} from '@ngrx/store';
import * as moment from 'moment';
import {
  RepairPlanContentInterface
} from '../api';

export interface RepairPlanSingleDataInterface {
  type: string;
  plan_time: string;
  apply_place: string;
  area: string;
  content: RepairPlanContentInterface[];
  number: string;
  direction: string;
  post_date: moment.Moment;
  id: number;
}


export interface RepairPlanAndHistoryDataSorted {
  date: moment.Moment;
  repair_plan_data_index_on_this_day: number[];
  repair_history_data_index_on_this_day: number[];
  plan_history_can_match_together: [number, number][];
}

export interface RepairHistoryCollectStoreInterface {
  which_sidenav_open: 'date_select' | 'date_list' | '';
  repair_history_data: RepairHistorySingleDataInterface[];
  start_date?: moment.Moment;
  end_date?: moment.Moment;
  repair_plan_data: RepairPlanSingleDataInterface[];
  repair_plan_and_history_sorted_by_date: RepairPlanAndHistoryDataSorted[];
  show_all_dates_on_dates_header: boolean;
  pending: {
    repair_plan: boolean;
    repair_history: boolean;
  }; // 各种pending的状态
}

export interface RepairHistorySingleDataInterface {
  date: moment.Moment;
  repair_content: string;
  number: string;
  plan_type: string;
  repair_department: string;
  inner_id: string;
  use_paper: boolean;
  apply_place: string;
  plan_time: string;
  id?: number;
}


export const CHANGE_SELECTED_DATE = '[history]CHANGE_SELECTED_DATE';

export class ChangeSelectedDate implements Action {
  readonly type = CHANGE_SELECTED_DATE;

  constructor(public payload: { start_date: moment.Moment, end_date: moment.Moment }) {
  }
}

export const UPDATE_REPAIR_DATA = '[repair-history-collect]UPDATE_REPAIR_DATA'; // 更新天窗修计划数据

export class UpdateRepairData implements Action {
  readonly type = UPDATE_REPAIR_DATA;

  constructor(public payload: { data: RepairPlanSingleDataInterface[] }) {

  }
}

export const SWITCH_OPEN_WHICH_SIDEBAR = '[history]SWITCH_OPEN_WHICH_SIDEBAR';

export class SwitchOpenWhichSidebar implements Action {
  readonly type = SWITCH_OPEN_WHICH_SIDEBAR;

  constructor(public payload: 'date_select' | '' | 'date_list') {
  }
}

export const SWITCH_PENDING_REPAIR_PLAN = '[repair-history-collect]SWITCH_PENDING_REPAIR_PLAN';

export class SwitchPendingRepairPlan implements Action {
  readonly type = SWITCH_PENDING_REPAIR_PLAN;

  constructor(public payload: boolean) {

  }
}


export const SWITCH_SHOW_ALL_DATES_ON_DATES_HEADER = '[repair-history-collect]SWITCH_SHOW_ALL_DATES_ON_DATES_HEADER';  //

export class SwitchShowAllDatesOnDatesHeader implements Action {
  readonly type = SWITCH_SHOW_ALL_DATES_ON_DATES_HEADER;

  constructor(public payload: boolean) {

  }
}

export const UPDATE_SORTED_REPAIR_PLAN_DATA = '[repair-history-collect]UPDATE_SORTED_REPAIR_PLAN_DATA';

export class UpdateSortedRepairPlanData implements Action {
  readonly type = UPDATE_SORTED_REPAIR_PLAN_DATA;

  constructor(public payload: { date: moment.Moment, repair_plan_data_index_on_this_day: number[] }[]) {

  }
}

export const SWITCH_GET_HISTORY_DATA_PENDING = '[repair-history-collect]SWITCH_GET_HISTORY_DATA_PENDING';

export class SwitchGetHistoryDataPending implements Action {
  readonly type = SWITCH_GET_HISTORY_DATA_PENDING;

  constructor(public payload: boolean) {

  }
}

export const UPDATE_SORTED_REPAIR_HISTORY_DATA = '[repair-history-collect]UPDATE_SORTED_REPAIR_HISTORY_DATA';

export class UpdateSortedRepairHistoryData implements Action {
  readonly type = UPDATE_SORTED_REPAIR_HISTORY_DATA;

  constructor(public payload: {
    date: moment.Moment, repair_history_data_index_on_this_day: number[]
  }[]) {
  }
}

export const UPDATE_REPAIR_HISTORY_DATA = '[repair-history-collect]UPDATE_REPAIR_HISTORY_DATA';

// 更新天窗修历史实绩集合
export class UpdateRepairHistoryData implements Action {
  readonly type = UPDATE_REPAIR_HISTORY_DATA;

  constructor(public payload: RepairHistorySingleDataInterface[]) {

  }
}


export type RepairHistoryCollectStoreActionType = SwitchOpenWhichSidebar
  | UpdateRepairHistoryData // 复制此行到ActionType中,更新天窗修历史实绩集合 action type
  | UpdateSortedRepairHistoryData // 复制此行到ActionType中
  | ChangeSelectedDate
  | SwitchGetHistoryDataPending // 复制此行到ActionType中
  | SwitchShowAllDatesOnDatesHeader   // 复制此行到ActionType中
  | UpdateRepairData // 复制此行到ActionType中
  | UpdateSortedRepairPlanData // 复制此行到ActionType中
  | SwitchPendingRepairPlan   // 复制此行到ActionType中
  ;
export const RepairHistoryCollectStoreActions = {
  UpdateSortedRepairHistoryData,  // 复制此行到导出的Action中
  UpdateRepairHistoryData,  // 复制此行到导出的Action中,更新天窗修历史实绩集合 actions
  SwitchPendingRepairPlan,  // 复制此行到导出的Action中
  SwitchGetHistoryDataPending, // 复制此行到导出的Action中
  SwitchOpenWhichSidebar,
  UpdateSortedRepairPlanData, // 复制此行到导出的Action中
  ChangeSelectedDate,
  UpdateRepairData, // 复制此行到导出的Action中
  SwitchShowAllDatesOnDatesHeader,  // 复制此行到导出的Action中
};


const default_state: RepairHistoryCollectStoreInterface = {
  repair_plan_and_history_sorted_by_date: [],
  start_date: null,
  end_date: null,
  repair_plan_data: [],
  pending: {repair_plan: false, repair_history: false},
  show_all_dates_on_dates_header: false,
  repair_history_data: [],
  which_sidenav_open: '',
};

function SortedDataByDate(data: RepairPlanAndHistoryDataSorted[]): RepairPlanAndHistoryDataSorted[] {
  return data.sort((a, b) => a.date.isSameOrBefore(b.date) ? -1 : 1);
}

export function reducer(state: RepairHistoryCollectStoreInterface = default_state,
                        action: RepairHistoryCollectStoreActionType): RepairHistoryCollectStoreInterface {
  switch (action.type) {
    case UPDATE_REPAIR_HISTORY_DATA:
      return {...state, repair_history_data: action.payload}; // 复制此两行到reducer中,更新天窗修历史实绩集合 reducer

    case UPDATE_SORTED_REPAIR_HISTORY_DATA:
      const _ = Array.from(state.repair_plan_and_history_sorted_by_date);
      for (const single_data of action.payload) {
        const index = _.findIndex(value => single_data.date.isSame(value.date));
        if (index < 0) {
          _.push({
            date: single_data.date,
            repair_history_data_index_on_this_day: single_data.repair_history_data_index_on_this_day,
            repair_plan_data_index_on_this_day: [],
            plan_history_can_match_together: [],
          });
        }
      }
      return {...state, repair_plan_and_history_sorted_by_date: SortedDataByDate(_)}; // 复制此两行到reducer中
    case SWITCH_GET_HISTORY_DATA_PENDING:
      return {...state, pending: {...state.pending, repair_history: action.payload}}; // 复制此两行到reducer中
    case UPDATE_SORTED_REPAIR_PLAN_DATA:
      // 首先对日期进行排序
      const repair_data_sorted = Array.from(state.repair_plan_and_history_sorted_by_date);
      for (const single_data of action.payload) {
        const repair_data_sorted_index = repair_data_sorted.findIndex(value => single_data.date.isSame(value.date));
        if (repair_data_sorted_index < 0) {
          repair_data_sorted.push({
            date: single_data.date,
            repair_plan_data_index_on_this_day: single_data.repair_plan_data_index_on_this_day,
            plan_history_can_match_together: [],
            repair_history_data_index_on_this_day: []
          });
        } else {
          repair_data_sorted[repair_data_sorted_index].repair_plan_data_index_on_this_day = single_data.repair_plan_data_index_on_this_day;
        }
      }
      return {...state, repair_plan_and_history_sorted_by_date: SortedDataByDate(repair_data_sorted)};  // 复制此两行到reducer中
    case SWITCH_SHOW_ALL_DATES_ON_DATES_HEADER:
      return {...state, show_all_dates_on_dates_header: action.payload};  // 复制此两行到reducer中
    case SWITCH_PENDING_REPAIR_PLAN:
      return {...state, pending: {...state.pending, repair_plan: action.payload}};  // 复制此两行到reducer中
    case SWITCH_OPEN_WHICH_SIDEBAR:
      if (state.which_sidenav_open !== action.payload) {
        return {...state, which_sidenav_open: action.payload};
      }
      return {...state, which_sidenav_open: ''};
    case CHANGE_SELECTED_DATE:
      return {...state, start_date: action.payload.start_date, end_date: action.payload.end_date};
    case UPDATE_REPAIR_DATA:
      return {...state, repair_plan_data: action.payload.data}; // 复制此两行到reducer中
    default:
      return state;
  }
}

export default reducer;
