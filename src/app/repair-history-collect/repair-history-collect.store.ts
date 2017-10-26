///<reference path="../api.ts"/>
import {Action} from '@ngrx/store';
import * as moment from 'moment';
import {
  RepairHistoryDataApiInterface, RepairHistoryDataSingleApiInterface, RepairPlanContentInterface,
  RepairPlanSingleDataApiInterface
} from '../api';
import {sort_data_by_date, add_a_value_to_sorted_object, generate_a_id, string_is_a_valid_time_range} from '../util_func';


export interface RepairPlanSingleDataInterface {
  type: 'Ⅰ' | 'Ⅱ' | '站' | '垂';
  plan_time: string;
  apply_place: string;
  area: string;
  content: RepairPlanContentInterface[];
  number: string;
  direction: string;
  date: moment.Moment;
  id: string;
  calc_time: boolean;
  start_time?: string;
  end_time?: string;
  used_number?: string;
}


export interface RepairPlanAndHistoryDataSorted {
  date: moment.Moment;
  repair_plan_data_index_on_this_day: { plan_number_id: string, history_number_id: string | null, is_manual: boolean }[];
  repair_history_data_index_on_this_day: string[];
  repair_history_data_not_map_in_plan: string[];
}

export interface RepairHistoryCollectStoreInterface {
  repair_history_data: { [id: string]: RepairHistorySingleDataInterface };
  start_date?: moment.Moment;
  end_date?: moment.Moment;
  repair_plan_data: { [id: string]: RepairPlanSingleDataInterface };
  repair_plan_and_history_sorted_by_date: RepairPlanAndHistoryDataSorted[];
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
  };
  dialog_settings: {
    which_dialog_open: 'repair_plan' | 'repair_history' | '';
    dialog_id: string | null;
  };
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
  id?: string;
  used_number: string;
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

  constructor(public payload: RepairHistorySingleDataInterface[]) {

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

  constructor() {

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

export const OPEN_OR_CLOSE_A_DIALOG = '[repair-history-collect]OPEN_OR_CLOSE_A_DIALOG';  // 控制修改或者添加单元格的打开

export class OpenOrCloseADialog implements Action {
  readonly type = OPEN_OR_CLOSE_A_DIALOG;

  constructor(public payload: {
    dialog_type: '' | 'repair_plan' | 'repair_history',
    dialog_id?: string
  }) {

  }
}

export const UPDATE_REPAIR_PLAN_DATA = '[repair-history-collect]UPDATE_REPAIR_PLAN_DATA';  //

export class UpdateRepairPlanData implements Action {
  readonly type = UPDATE_REPAIR_PLAN_DATA;

  constructor(public payload: RepairPlanSingleDataInterface) {

  }
}

export const UPDATE_ALL_REPAIR_PLAN_DATA_FROM_SERVER = '[repair-history-collect]UPDATE_ALL_REPAIR_PLAN_DATA_FROM_SERVER';

// 从服务器的数据中更新数据，会对数据进行处理
export class UpdateAllRepairPlanDataFromServer implements Action {
  readonly type = UPDATE_ALL_REPAIR_PLAN_DATA_FROM_SERVER;

  constructor(public payload: { data: RepairPlanSingleDataApiInterface[] }) {

  }
}

export const UPDATE_ALL_REPAIR_HISTORY_DATA_FROM_SERVER = '[repair-history-collect]UPDATE_ALL_REPAIR_HISTORY_DATA_FROM_SERVER';

// 从服务器的数据中更新数据，会对数据进行处理
export class UpdateAllRepairHistoryDataFromServer implements Action {
  readonly type = UPDATE_ALL_REPAIR_HISTORY_DATA_FROM_SERVER;

  constructor(public payload: { data: RepairHistoryDataSingleApiInterface[] }) {

  }
}


export type RepairHistoryCollectStoreActionType = SwitchOpenWhichSidebar
  | UpdateAllRepairPlanDataFromServer // 复制此行到ActionType中,从服务器的数据中更新数据，会对数据进行处理 action type
  | UpdateAllRepairHistoryDataFromServer // 复制此行到ActionType中,从服务器的数据中更新数据，会对数据进行处理 action type
  | UpdateRepairPlanData   // 复制此行到ActionType中
  | UpdateWhichDateShouldDisplayOnContent // 复制此行到ActionType中,更新哪些日期可以在页面中显示 action type
  | SwitchOnlyShowOneDateOnContent // 复制此行到ActionType中,切换是否仅在内容框中显示一个日期 action type
  | MapPlanAndHistoryNumber   // 复制此行到ActionType中
  | AddOrRemoveDateToOpenedDatePanel   // 复制此行到ActionType中
  | UpdateRepairHistoryData // 复制此行到ActionType中,更新天窗修历史实绩集合 action type
  | ChangeSelectedDate
  | SwitchGetHistoryDataPending // 复制此行到ActionType中
  | SwitchShowAllDatesOnDatesHeader   // 复制此行到ActionType中
  | SwitchPendingRepairPlan   // 复制此行到ActionType中
  | OpenOrCloseADialog  // 复制此行到ActionType中
  ;
export const RepairHistoryCollectStoreActions = {
  OpenOrCloseADialog,  // 复制此行到导出的Action中
  UpdateAllRepairPlanDataFromServer,  // 复制此行到导出的Action中,从服务器的数据中更新数据，会对数据进行处理 actions
  UpdateWhichDateShouldDisplayOnContent,  // 复制此行到导出的Action中,更新哪些日期可以在页面中显示 actions
  UpdateRepairPlanData,  // 复制此行到导出的Action中
  SwitchOnlyShowOneDateOnContent,  // 复制此行到导出的Action中,切换是否仅在内容框中显示一个日期 actions
  MapPlanAndHistoryNumber,  // 复制此行到导出的Action中
  UpdateRepairHistoryData,  // 复制此行到导出的Action中,更新天窗修历史实绩集合 actions
  SwitchPendingRepairPlan,  // 复制此行到导出的Action中
  SwitchGetHistoryDataPending, // 复制此行到导出的Action中
  SwitchOpenWhichSidebar,
  ChangeSelectedDate,
  SwitchShowAllDatesOnDatesHeader,  // 复制此行到导出的Action中
  UpdateAllRepairHistoryDataFromServer,  // 复制此行到导出的Action中,从服务器的数据中更新数据，会对数据进行处理 actions
  AddOrRemoveDateToOpenedDatePanel,  // 复制此行到导出的Action中
};


const default_state: RepairHistoryCollectStoreInterface = {
  repair_plan_and_history_sorted_by_date: [],
  start_date: null,
  end_date: null,
  repair_plan_data: {},
  repair_history_data: {},
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
  },
  dialog_settings: {
    which_dialog_open: null,
    dialog_id: null,
  }
};


export function reducer(state: RepairHistoryCollectStoreInterface = default_state,
                        action: RepairHistoryCollectStoreActionType): RepairHistoryCollectStoreInterface {
  switch (action.type) {
    case UPDATE_REPAIR_PLAN_DATA:
      // 更新单个天窗修计划内容
      const index: string = generate_a_id(action.payload);
      // 按照天窗修编号及日期索引
      return {
        ...state, repair_plan_data: {
          ...state.repair_plan_data,
          index: action.payload
        }
      };  // 复制此两行到reducer中
    case OPEN_OR_CLOSE_A_DIALOG:
      // 打开或者关闭修改天窗修计划对话框
      return {
        ...state,
        dialog_settings: {
          ...state.dialog_settings,
          which_dialog_open: action.payload.dialog_type,
          dialog_id: action.payload.dialog_type === '' ? null : action.payload.dialog_id
        }
      };  // 复制此两行到reducer中
    case UPDATE_WHICH_DATE_SHOULD_DISPLAY_ON_CONTENT:
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
        const index = _not_displayed_data.findIndex(value => value.isSame(action.payload.date));
        if (index >= 0) {
          _not_displayed_data.splice(index, 1);
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
      const date_array: RepairPlanAndHistoryDataSorted[] = [];
      for (const v of Object.keys(state.repair_plan_data)) {
        add_a_value_to_sorted_object(
          state.repair_plan_data[v].date,
          date_array,
          state.repair_plan_data[v].id,
          'plan');
      }
      for (const v of Object.keys(state.repair_history_data)) {
        add_a_value_to_sorted_object(
          state.repair_history_data[v].date,
          date_array, state.repair_history_data[v].id,
          'history');
      }
      // 提取所有需要的date对象
      for (const single_date of date_array) {
        const not_include_history_data: string[] = [];
        for (const i of single_date.repair_plan_data_index_on_this_day) {
          const plan_number = state.repair_plan_data[i.plan_number_id].used_number;
          if (i.is_manual) {
            // 对人工匹配的项目不进行干预
          } else {
            for (const history_id of single_date.repair_history_data_index_on_this_day) {
              if (state.repair_history_data[history_id].used_number === plan_number) {
                i.history_number_id = history_id;
                break;
              }
            }
          }
        }
        for (const i of single_date.repair_history_data_index_on_this_day) {
          if (single_date.repair_plan_data_index_on_this_day.findIndex(value => value.history_number_id === i) < 0) {
            not_include_history_data.push(i);
          }
        }
        single_date.repair_history_data_not_map_in_plan = not_include_history_data;
      }
      if (state.content_settings.not_displayed_data) {

      } else {

      }
      return {...state, repair_plan_and_history_sorted_by_date: date_array};  // 复制此两行到reducer中
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
      return {...state, repair_history_data: {}}; // 复制此两行到reducer中,更新天窗修历史实绩集合 reducer

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
    case CHANGE_SELECTED_DATE:
      return {...state, start_date: action.payload.start_date, end_date: action.payload.end_date};
    case UPDATE_ALL_REPAIR_PLAN_DATA_FROM_SERVER:
      // 处理服务器返回的数据
      const new_repair_plan_list: { [id: string]: RepairPlanSingleDataInterface } = {};
      action.payload.data.forEach(v => {
        const is_a_time = string_is_a_valid_time_range(v.plan_time);
        let type;
        switch (v.type) {
          case 'Ⅱ':
            type = v.type;
            break;
          case 'Ⅰ':
            type = v.type;
            break;
          default:
            type = '站';
        }
        new_repair_plan_list[generate_a_id(v)] = {
          type: type,
          number: v.number,
          date: moment(v.post_date),
          apply_place: v.apply_place,
          id: generate_a_id(v),
          calc_time: !!is_a_time,
          start_time: is_a_time ? is_a_time[1] : null,
          end_time: is_a_time ? is_a_time[2] : null,
          plan_time: v.plan_time,
          area: v.area,
          content: [],
          direction: v.direction,
          used_number: `${v.type === '站' ? 'Z' : (v.type === '垂' ? 'D' : 'J')}${v.number}`
        };
      });
      return {...state, repair_plan_data: new_repair_plan_list}; // 复制此两行到reducer中,从服务器的数据中更新数据，会对数据进行处理 reducer
    case UPDATE_ALL_REPAIR_HISTORY_DATA_FROM_SERVER:
      const new_repair_history_list: { [id: string]: RepairHistorySingleDataInterface } = {};
      action.payload.data.forEach(
        v => {
          const used_number = v.number.split('-').length === 2 ? v.number.split('-')[1] : null;
          new_repair_history_list[generate_a_id(v)] = {
            date: moment(v.date),
            number: v.number,
            plan_time: v.plan_time,
            id: generate_a_id(v),
            apply_place: v.apply_place,
            inner_id: v.inner_id,
            plan_type: v.plan_type,
            repair_content: v.repair_content,
            repair_department: v.repair_department,
            use_paper: v.use_paper,
            used_number: used_number
          };
        }
      );
      return {
        ...state, repair_history_data: new_repair_history_list
      }; // 复制此两行到reducer中,从服务器的数据中更新数据，会对数据进行处理 reducer
    default:
      return state;
  }
}

export default reducer;
