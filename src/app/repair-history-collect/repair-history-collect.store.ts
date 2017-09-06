import {Action} from '@ngrx/store';
import * as moment from 'moment';
import {RepairPlanApi, RepairPlanSingleDataInterface} from '../api';

export const SWITCH_OPEN_PANEL = '[history]SWITCH_OPEN_PANEL';
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


export class SwitchOpenPanel implements Action {
  readonly type = SWITCH_OPEN_PANEL;

  constructor(public payload: boolean) {
  }
}

export const SWITCH_PENDING_REPAIR_PLAN = '[repair-history-collect]SWITCH_PENDING_REPAIR_PLAN';

export class SwitchPendingRepairPlan implements Action {
  readonly type = SWITCH_PENDING_REPAIR_PLAN;

  constructor(public payload: boolean) {

  }
}

export type RepairHistoryCollectStoreActionType = SwitchOpenPanel
  | ChangeSelectedDate
  | UpdateRepairData // 复制此行到ActionType中
  | SwitchPendingRepairPlan   // 复制此行到ActionType中
  ;
export const RepairHistoryCollectStoreActions = {
  switchPendingRepairPlan: SwitchPendingRepairPlan,  // 复制此行到导出的Action中
  SwitchOpenPanel,
  ChangeSelectedDate,
  updateRepairData: UpdateRepairData, // 复制此行到导出的Action中
};

export interface RepairHistoryCollectStoreInterface {
  open_select_panel: boolean;
  start_date?: moment.Moment;
  end_date?: moment.Moment;
  repair_plan_data: RepairPlanSingleDataInterface[];
  pending: {
    repair_plan: boolean;
  }; // 各种pending的状态
}

const default_state: RepairHistoryCollectStoreInterface = {
  open_select_panel: true,
  start_date: null,
  end_date: null,
  repair_plan_data: [],
  pending: {repair_plan: false}
};

export function reducer(state: RepairHistoryCollectStoreInterface = default_state,
                        action: RepairHistoryCollectStoreActionType): RepairHistoryCollectStoreInterface {
  switch (action.type) {
    case SWITCH_PENDING_REPAIR_PLAN:
      return {...state, pending: {...state.pending, repair_plan: action.payload}};  // 复制此两行到reducer中
    case SWITCH_OPEN_PANEL:
      return {...state, open_select_panel: action.payload};
    case CHANGE_SELECTED_DATE:
      return {...state, start_date: action.payload.start_date, end_date: action.payload.end_date};
    case UPDATE_REPAIR_DATA:
      return {...state, repair_plan_data: action.payload.data}; // 复制此两行到reducer中
    default:
      return state;
  }
}

export default reducer;
