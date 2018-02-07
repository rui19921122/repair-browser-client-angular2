///<reference path="../api.ts"/>
import {Action} from '@ngrx/store';
import * as moment from 'moment';
import * as _ from 'lodash';
import {
  RepairHistoryApiInterface,
  RepairPlanContentInterface,
  RepairPlanDataApiInterface
} from '../api';
import {
  sort_data_by_date,
  generate_a_id,
  string_is_a_valid_time_range, add_or_change_obj_from_array_by_id, get_obj_from_array_by_id, delete_obj_from_array_by_id
} from '../util_func';

export interface RepairDataInterface {
  type: '局' | '站' | '垂';
  plan_time: string;
  apply_place: string;
  area: string;
  number: string;
  used_number?: string;
  date: moment.Moment;
  id: string;
  plan_calc_time: boolean;
  plan_start_time?: moment.Moment;
  plan_end_time?: moment.Moment;
  plan_longing: number; // 持续  update_time: moment.Moment;
  actual_start_time: moment.Moment | null;
  actual_end_time: moment.Moment | null;
  actual_start_number: string | null;
  actual_end_number: string | null;
  actual_watcher: string; // 把关人
  actual_longing: number;
  canceled: boolean;
}

export interface RepairPlanDataStoreInterface {
  type: '局' | '站' | '垂';
  plan_time: string;
  apply_place: string;
  area: string;
  number: string;
  date: moment.Moment;
  id: string;
  calc_time: boolean;
  start_time?: string;
  end_time?: string;
  used_number?: string;
  longing: number; // 持续时间，以分钟为单位
}


export interface RepairPlanAndHistoryDataMappedInterface {
  date: moment.Moment;
  repair_plan_data_index_on_this_day: {
    plan_number_id: string, history_number_id: string | null, is_manual: boolean, valid: {
      valid: boolean, error: string
    }
  }[];
  repair_history_data_not_map_in_plan: string[];
}

export interface RepairHistoryCollectStoreInterface {
  repair_data: RepairDataInterface[];
  start_date?: moment.Moment;
  end_date?: moment.Moment;
  repair_plan_data: RepairPlanDataStoreInterface[];
  repair_plan_and_history_data_mapped: RepairPlanAndHistoryDataMappedInterface[];
  repair_detail_data: RepairDetailDataStoreInterface[];
  repair_history_data: RepairHistoryDataStoreInterface[];
  show_all_dates_on_dates_header: boolean;
  pending: {
    repair_plan: boolean;
    repair_history: boolean;
  }; // 各种pending的状态
  side_nav_settings: {
    opened_date_index: moment.Moment[]; // 侧边栏中哪些日期默认打开
    which_sidenav_open: 'date_select' | 'date_list' | ''; // 打开哪个侧边栏
  };
  content_settings: {
    not_displayed_data: moment.Moment[]; // 哪些日期在多日期展示模式下屏蔽
    displayed_data: moment.Moment; // 哪个日期在单日期展示下呈现
    only_show_on_day_on_content: boolean;
    show_detail_method: 'table' | 'card';
    can_safe_destroy: boolean,
    witch_number_is_in_edit: {
      method: 'history' | 'plan' | '',
      number: string
    },
    only_show_invalid_data: boolean;
  };
  post_settings: {
    // 在向服务器上传数据前使用，当此项为True时，代表用户已经知晓当前要上传的日期与服务器上已存储的日期有冲突，会被覆盖
    user_checked_the_date_is_conflicted: boolean;
  };
}

export interface RepairDetailDataStoreInterface {
  update_time: moment.Moment;
  actual_start_time: moment.Moment | null;
  actual_end_time: moment.Moment | null;
  actual_start_number: string | null;
  actual_end_number: string | null;
  actual_watcher: string; // 把关人
  longing: number;
  canceled: boolean;
  id: string;
  note: string;
}

export interface RepairHistoryDataStoreInterface {
  date: moment.Moment;
  repair_content?: string;
  number: string;
  plan_type?: string;
  repair_department?: string;
  inner_id: string;
  use_paper: boolean;
  apply_place?: string;
  plan_time?: string;
  id: string;
  used_number: string;
  cached: number;
  // 0 未从服务器获得数据 1 已从服务器获得数据 2 未从服务器获得数据且已被手动修改 3 已从服务器获得数据且被手动修改
}


export const CHANGE_SELECTED_DATE = '[history]CHANGE_SELECTED_DATE';

export class ChangeSelectedDate implements Action {
  readonly type = CHANGE_SELECTED_DATE;

  constructor(public payload: { start_date: moment.Moment, end_date: moment.Moment }) {
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


export const SWITCH_GET_HISTORY_DATA_PENDING = '[repair-history-collect]SWITCH_GET_HISTORY_DATA_PENDING';

export class SwitchGetHistoryDataPending implements Action {
  readonly type = SWITCH_GET_HISTORY_DATA_PENDING;

  constructor(public payload: boolean) {

  }
}

export const UPDATE_REPAIR_HISTORY_DATA = '[repair-history-collect]UPDATE_REPAIR_HISTORY_DATA';

// 更新天窗修历史实绩集合
export class UpdateRepairHistoryData implements Action {
  readonly type = UPDATE_REPAIR_HISTORY_DATA;

  constructor(public payload: RepairHistoryDataStoreInterface[]) {

  }
}


export const ADD_OR_REMOVE_DATE_TO_OPENED_DATE_PANEL = '[repair-history-collect]ADD_OR_REMOVE_DATE_TO_OPENED_DATE_PANEL';  //

export class AddOrRemoveDateToOpenedDatePanel implements Action {
  readonly type = ADD_OR_REMOVE_DATE_TO_OPENED_DATE_PANEL;

  constructor(public payload: { date: moment.Moment, boolean: boolean }) {

  }
}

export const MAP_PLAN_AND_HISTORY_NUMBER = '[repair-history-collect]MAP_PLAN_AND_HISTORY_NUMBER';  //

export class MapPlanAndHistoryNumber implements Action {
  // 此计算将根据state现有的plan和history状态构建排序后的数据，计算量可能较大，需要想办法优化的话就优化。
  readonly type = MAP_PLAN_AND_HISTORY_NUMBER;

  constructor(public payload: { data: RepairHistoryCollectStoreInterface['repair_plan_and_history_data_mapped'] }) {

  }
}

export const SWITCH_ONLY_SHOW_ONE_DATE_ON_CONTENT = '[repair-history-collect]SWITCH_ONLY_SHOW_ONE_DATE_ON_CONTENT';

// 切换是否仅在内容框中显示一个日期
export class SwitchOnlyShowOneDateOnContent implements Action {
  readonly type = SWITCH_ONLY_SHOW_ONE_DATE_ON_CONTENT;

  constructor() {

  }
}

export const UPDATE_WHICH_DATE_SHOULD_DISPLAY_ON_CONTENT = '[repair-history-collect]UPDATE_WHICH_DATE_SHOULD_DISPLAY_ON_CONTENT';

// 更新哪些日期可以在页面中显示
export class UpdateWhichDateShouldDisplayOnContent implements Action {
  readonly type = UPDATE_WHICH_DATE_SHOULD_DISPLAY_ON_CONTENT;

  constructor(public payload: { date: moment.Moment, type?: 'add' | 'reduce' }) {

  }
}

export const EDIT_DATA_BY_ID = '[repair-history-collect]EDIT_DATA_BY_ID';  // 控制修改或者添加单元格的打开

export class EditDataById implements Action {
  readonly type = EDIT_DATA_BY_ID;

  constructor(public payload: {
    dialog_type: '' | 'plan' | 'history',
    dialog_id?: string
  }) {

  }
}

export const UPDATE_REPAIR_PLAN_DATA = '[repair-history-collect]UPDATE_REPAIR_PLAN_DATA';  //

export class UpdateRepairPlanData implements Action {
  readonly type = UPDATE_REPAIR_PLAN_DATA;

  constructor(public payload: RepairPlanDataStoreInterface) {

  }
}


export const ADD_A_REPAIR_PLAN_DATA = '[repair-history-collect]ADD_A_REPAIR_PLAN_DATA';

//
export class AddARepairPlanData implements Action {
  readonly type = ADD_A_REPAIR_PLAN_DATA;

  constructor(public payload: { data: RepairPlanDataStoreInterface }) {

  }
}

export const REPLACE_ALL_HISTORY_DATA = '[repair-history-collect]REPLACE_ALL_HISTORY_DATA';

// 更换所有的历史数据
export class ReplaceAllHistoryData implements Action {
  readonly type = REPLACE_ALL_HISTORY_DATA;

  constructor(public payload: { data: RepairHistoryDataStoreInterface[] }) {

  }
}

// 从服务器的数据中更新数据，会对数据进行处理

export const UPDATE_SINGLE_REPAIR_HISTORY_DETAIL_DATA = '[repair-history-collect]UPDATE_SINGLE_REPAIR_HISTORY_DETAIL_DATA';  //

export class UpdateSingleRepairHistoryDetailData implements Action {
  readonly type = UPDATE_SINGLE_REPAIR_HISTORY_DETAIL_DATA;

  constructor(public payload: { value: RepairDetailDataStoreInterface, id: string }) {

  }
}


export const REPLACE_ALL_REPAIR_DATA = '[repair-history-collect]REPLACE_ALL_REPAIR_DATA';

// 更新所有计划
export class ReplaceAllRepairData implements Action {
  readonly type = REPLACE_ALL_REPAIR_DATA;

  constructor(public payload: { data: RepairPlanDataStoreInterface[] }) {

  }
}

export const UPDATE_QUERY_DETAIL_LIST = '[repair-history-collect]UPDATE_QUERY_DETAIL_LIST';

// 更新query查询计划列表
export class UpdateQueryDetailList implements Action {
  readonly type = UPDATE_QUERY_DETAIL_LIST;

  constructor(public payload: { data: Set<string> }) {

  }
}

export const CHANGE_SHOW_DETAIL_METHOD = '[repair-collect]CHANGE_SHOW_DETAIL_METHOD';

// 变更展示数据的方式
export class ChangeShowDetailMethod implements Action {
  readonly type = CHANGE_SHOW_DETAIL_METHOD;

  constructor(public payload: {}) {

  }
}

export const SWITCH_INVALID_DATA_DISPLAY_METHOD = '[repair-collect]SWITCH_INVALID_DATA_DISPLAY_METHOD';

// 切换是否仅显示有错误的计划
export class SwitchInvalidDataDisplayMethod implements Action {
  readonly type = SWITCH_INVALID_DATA_DISPLAY_METHOD;

  constructor() {

  }
}

export interface EditWholeDetailInterface {
  date: string;
  number: string;
  used_number: string;
  type: '局' | '站' | '垂';
  area: string;
  plan_start_time?: string;
  plan_end_time?: string;
  plan_longing: number;
  plan_calc_time: boolean;
  detail_start_time?: string;
  detail_end_time?: string;
  detail_longing: number;
  detail_start_number: string;
  detail_end_number: string;
  detail_watcher: string;
  note: string;
  use_paper: boolean;
  is_canceled: boolean;
}


export const EDIT_WHOLE_DETAIL = '[repair-collect]EDIT_WHOLE_DETAIL';

// 以一个完成的记录更新
export class EditWholeDetail implements Action {
  readonly type = EDIT_WHOLE_DETAIL;

  constructor(public payload: {
    form: EditWholeDetailInterface,
    detail?: RepairDetailDataStoreInterface,
    plan?: RepairPlanDataStoreInterface,
    history?: RepairHistoryDataStoreInterface
  }) {

  }
}

export type RepairHistoryCollectStoreActionType =
  SwitchOpenWhichSidebar
  | EditWholeDetail // 复制此行到ActionType中,以一个完成的记录更新 action type
  | UpdateQueryDetailList // 复制此行到ActionType中,更新query查询计划列表 action type
  | ReplaceAllRepairData // 复制此行到ActionType中,更新所以的字节 action type
  | ReplaceAllHistoryData // 复制此行到ActionType中,更换所有的历史数据 action type
// 复制此行到ActionType中,更新天窗修实际查询的pending action type
  | UpdateSingleRepairHistoryDetailData  // 复制此行到ActionType中
  | UpdateRepairPlanData   // 复制此行到ActionType中
  | SwitchInvalidDataDisplayMethod // 复制此行到ActionType中,切换是否仅显示有错误的计划 action type
  | UpdateWhichDateShouldDisplayOnContent // 复制此行到ActionType中,更新哪些日期可以在页面中显示 action type
  | SwitchOnlyShowOneDateOnContent // 复制此行到ActionType中,切换是否仅在内容框中显示一个日期 action type
  | MapPlanAndHistoryNumber   // 复制此行到ActionType中
  | ChangeShowDetailMethod // 复制此行到ActionType中,变更展示数据的方式 action type
  | AddOrRemoveDateToOpenedDatePanel   // 复制此行到ActionType中
  | UpdateRepairHistoryData // 复制此行到ActionType中,更新天窗修历史实绩集合 action type
  | ChangeSelectedDate
  | SwitchGetHistoryDataPending // 复制此行到ActionType中
  | SwitchShowAllDatesOnDatesHeader   // 复制此行到ActionType中
  | SwitchPendingRepairPlan   // 复制此行到ActionType中
  | AddARepairPlanData // 复制此行到ActionType中, action type
  | EditDataById  // 复制此行到ActionType中
  ;
export const RepairHistoryCollectStoreActions = {
  ReplaceAllRepairData,  // 复制此行到导出的Action中,更新所以的字节 actions
  ReplaceAllHistoryData,  // 复制此行到导出的Action中,更换所有的历史数据 actions
  EditDataById,  // 复制此行到导出的Action中
  UpdateQueryDetailList,  // 复制此行到导出的Action中,更新query查询计划列表 actions
  AddARepairPlanData,  // 复制此行到导出的Action中, actions
  UpdateWhichDateShouldDisplayOnContent,  // 复制此行到导出的Action中,更新哪些日期可以在页面中显示 actions
  UpdateSingleRepairHistoryDetailData,  // 复制此行到导出的Action中
  UpdateRepairPlanData,  // 复制此行到导出的Action中
  SwitchOnlyShowOneDateOnContent,  // 复制此行到导出的Action中,切换是否仅在内容框中显示一个日期 actions
  MapPlanAndHistoryNumber,  // 复制此行到导出的Action中
  UpdateRepairHistoryData,  // 复制此行到导出的Action中,更新天窗修历史实绩集合 actions
  SwitchPendingRepairPlan,  // 复制此行到导出的Action中
  SwitchGetHistoryDataPending, // 复制此行到导出的Action中
  SwitchOpenWhichSidebar,
  ChangeSelectedDate,
  SwitchShowAllDatesOnDatesHeader,  // 复制此行到导出的Action中
  AddOrRemoveDateToOpenedDatePanel,  // 复制此行到导出的Action中
  EditWholeDetail,  // 复制此行到导出的Action中,以一个完成的记录更新 actions
  SwitchInvalidDataDisplayMethod,  // 复制此行到导出的Action中,切换是否仅显示有错误的计划 actions
  ChangeShowDetailMethod,  // 复制此行到导出的Action中,变更展示数据的方式 actions
};


const default_state: RepairHistoryCollectStoreInterface = {
  repair_data: [],
  repair_plan_and_history_data_mapped: [],
  start_date: null,
  end_date: null,
  repair_plan_data: [],
  repair_history_data: [],
  pending: {repair_plan: false, repair_history: false},
  show_all_dates_on_dates_header: false,
  side_nav_settings: {
    opened_date_index: [],
    which_sidenav_open: '',
  },
  content_settings: {
    not_displayed_data: [],
    only_show_on_day_on_content: true,
    displayed_data: null,
    show_detail_method: 'table',
    can_safe_destroy: true,
    witch_number_is_in_edit: {method: '', number: null},
    only_show_invalid_data: false
  },
  repair_detail_data: [],
  post_settings: {user_checked_the_date_is_conflicted: false},
};


export function reducer(state: RepairHistoryCollectStoreInterface = default_state,
                        action: RepairHistoryCollectStoreActionType): RepairHistoryCollectStoreInterface {
  switch (action.type) {
    case SWITCH_INVALID_DATA_DISPLAY_METHOD:
      return {
        ...state, content_settings: {
          ...state.content_settings,
          only_show_invalid_data: !state.content_settings.only_show_invalid_data
        }
      }; // 复制此两行到reducer中,切换是否仅显示有错误的计划 reducer
    case EDIT_WHOLE_DETAIL:
      let history = Array.from(state.repair_history_data);
      let history_index = -1;
      let plan = Array.from(state.repair_plan_data);
      let plan_index = -1;
      let detail = Array.from(state.repair_detail_data);
      let detail_index = -1;
      if (action.payload.history) {
        const __ = delete_obj_from_array_by_id(state.repair_history_data, action.payload.history.id);
        history = __.objects;
        history_index = __.index;
      }
      if (action.payload.plan) {
        const __ = delete_obj_from_array_by_id(state.repair_plan_data, action.payload.plan.id);
        plan = __.objects;
        plan_index = __.index;
      }
      if (action.payload.detail) {
        const __ = delete_obj_from_array_by_id(state.repair_detail_data, action.payload.detail.id);
        detail = __.objects;
        detail_index = __.index;
      }
      const generate_history = {
        id: generate_a_id(action.payload.form),
        number: action.payload.form.used_number,
        used_number: action.payload.form.used_number,
        use_paper: action.payload.form.use_paper,
        apply_place: action.payload.form.area,
        inner_id: '',
        date: moment(action.payload.form.date),
        cached: 3
      };
      if (history_index < 0) {
        history.push(
          generate_history
        );
      } else {
        history.splice(history_index, 0, generate_history);
      }
      const generate_plan = {
        end_time: action.payload.form.plan_end_time,
        start_time: action.payload.form.plan_start_time,
        longing: action.payload.form.plan_longing,
        used_number: action.payload.form.used_number,
        number: action.payload.form.number,
        calc_time: action.payload.form.plan_calc_time,
        plan_time: `${action.payload.form.plan_start_time}-${action.payload.form.plan_end_time}`,
        type: action.payload.form.type,
        date: moment(action.payload.form.date),
        apply_place: '',
        area: action.payload.form.area,
        id: generate_a_id(action.payload.form)
      };
      if (plan_index < 0) {
        plan.push(generate_plan);
      } else {
        plan.splice(plan_index, 0, generate_plan);
      }
      const generate_detail = {
        longing: action.payload.form.detail_longing,
        actual_end_time: action.payload.form.detail_end_time ? moment(action.payload.form.detail_end_time, 'HH:mm') : null,
        update_time: moment(),
        actual_start_time: action.payload.form.detail_start_time ? moment(action.payload.form.detail_start_time, 'HH:mm') : null,
        actual_watcher: action.payload.form.detail_watcher,
        id: generate_a_id(action.payload.form),
        actual_end_number: action.payload.form.detail_end_number,
        actual_start_number: action.payload.form.detail_start_number,
        note: action.payload.form.note,
        canceled: action.payload.form.is_canceled
      };
      if (detail_index < 0) {
        detail.push(generate_detail);
      } else {
        detail.splice(detail_index, 0, generate_detail);
      }
      return {
        ...state, repair_plan_data: plan, repair_history_data: history, repair_detail_data: detail,
        content_settings: {...state.content_settings, witch_number_is_in_edit: {number: null, method: ''}}
      };
    // 复制此两行到reducer中,以一个完成的记录更新 reducer
    case REPLACE_ALL_HISTORY_DATA:
      return {...state, repair_history_data: action.payload.data}; // 复制此两行到reducer中,更换所有的历史数据 reducer
    case REPLACE_ALL_REPAIR_DATA:
      return {...state, repair_plan_data: action.payload.data}; // 复制此两行到reducer中,更新所以的字节 reducer
    case UPDATE_SINGLE_REPAIR_HISTORY_DETAIL_DATA:
      return {
        ...state,
        repair_detail_data: add_or_change_obj_from_array_by_id(
          state.repair_detail_data,
          action.payload.value
        ).objects  // 复制此两行到reducer中
      };
    case
    UPDATE_REPAIR_PLAN_DATA:
      // 更新单个天窗修计划内容
      const current_plan_data = Array.from(state.repair_plan_data);
      const obj = add_or_change_obj_from_array_by_id(current_plan_data, {
        ...action.payload,
        id: generate_a_id(action.payload),
      });
      // 按照天窗修编号及日期索引
      return {
        ...state,
        repair_plan_data: obj.objects
      };  // 复制此两行到reducer中
    case
    EDIT_DATA_BY_ID:
      // 打开或者关闭修改天窗修计划对话框
      return {
        ...state,
        content_settings: {
          ...state.content_settings,
          witch_number_is_in_edit: {
            method: action.payload.dialog_type,
            number: action.payload.dialog_id
          }
        }
      };  // 复制此两行到reducer中
    case
    UPDATE_WHICH_DATE_SHOULD_DISPLAY_ON_CONTENT:
      // 如果仅显示一个日期，则直接将值设为给定的日期
      if (state.content_settings.only_show_on_day_on_content) {
        return {
          ...state, content_settings: {
            ...state.content_settings, displayed_data: action.payload.date
          }
        };
      } else {
        // 如果显示多个日期，则按是否在数组中存在进行判断，如存在，则移去，如不存在，则增加,顺手把displayed_data设置为null，以避免内存泄漏
        const _not_displayed_data = Array.from(state.content_settings.not_displayed_data);
        const this_index = _not_displayed_data.findIndex(value => value.isSame(action.payload.date));
        if (this_index >= 0) {
          _not_displayed_data.splice(this_index, 1);
        } else {
          _not_displayed_data.push(action.payload.date);
        }
        return {
          ...state, content_settings: {
            ...state.content_settings, not_displayed_data: _not_displayed_data, displayed_data: null
          }
        };
      }
    // 复制此两行到reducer中,更新哪些日期可以在页面中显示 reducer
    case
    ADD_A_REPAIR_PLAN_DATA:
      const new_repair_plan_data = Array.from(state.repair_plan_data);
      new_repair_plan_data.push(action.payload.data);
      return {...state, repair_plan_data: new_repair_plan_data}; // 复制此两行到reducer中, reducer
    case
    SWITCH_ONLY_SHOW_ONE_DATE_ON_CONTENT:
      return {
        ...state,
        content_settings: {
          ...state.content_settings,
          only_show_on_day_on_content: !state.content_settings.only_show_on_day_on_content
        }
      }; // 复制此两行到reducer中,切换是否仅在内容框中显示一个日期 reducer
    case
    MAP_PLAN_AND_HISTORY_NUMBER:
      // 重构于2017年12月22日10点32分
      return {...state, repair_plan_and_history_data_mapped: action.payload.data};
    case
    ADD_OR_REMOVE_DATE_TO_OPENED_DATE_PANEL:
      const opened_date_panel = [
        ...state.side_nav_settings.opened_date_index
      ];
      const opened_date_panel_index = opened_date_panel.findIndex(value => value.isSame(action.payload.date));
      if (action.payload.boolean) {
        if (opened_date_panel_index >= 0) {
        } else {
          opened_date_panel.push(action.payload.date);
        }
      } else {
        if (opened_date_panel_index >= 0) {
          opened_date_panel.splice(opened_date_panel_index, 1);
        }
      }
      return {...state, side_nav_settings: {...state.side_nav_settings, opened_date_index: opened_date_panel}};  // 复制此两行到reducer中
    case
    UPDATE_REPAIR_HISTORY_DATA:
      // todo 未实现
      return {...state}; // 复制此两行到reducer中,更新天窗修历史实绩集合 reducer
    case
    SWITCH_GET_HISTORY_DATA_PENDING:
      return {...state, pending: {...state.pending, repair_history: action.payload}}; // 复制此两行到reducer中
    case
    SWITCH_SHOW_ALL_DATES_ON_DATES_HEADER:
      return {...state, show_all_dates_on_dates_header: action.payload};  // 复制此两行到reducer中
    case
    SWITCH_PENDING_REPAIR_PLAN:
      return {...state, pending: {...state.pending, repair_plan: action.payload}};  // 复制此两行到reducer中
    case
    SWITCH_OPEN_WHICH_SIDEBAR:
      if (state.side_nav_settings.which_sidenav_open !== action.payload) {
        return {
          ...state, side_nav_settings: {
            ...state.side_nav_settings,
            which_sidenav_open: action.payload
          }
        };
      }
      return {...state, side_nav_settings: {...state.side_nav_settings, which_sidenav_open: ''}};
    case
    CHANGE_SELECTED_DATE:
      return {...state, start_date: action.payload.start_date, end_date: action.payload.end_date};
    default:
      return state;
  }
}

export default reducer;
