///<reference path="../api.ts"/>
import {Action} from '@ngrx/store';
import * as moment from 'moment';
import {
    RepairPlanContentInterface
} from '../api';
import {Observable} from 'rxjs/Observable';

function SortedDataByDate(data: RepairPlanAndHistoryDataSorted[]): RepairPlanAndHistoryDataSorted[] {
    return data.sort((a, b) => a.date.isSameOrBefore(b.date) ? -1 : 1);
}

const add_a_value_to_sorted_object = (date: moment.Moment,
                                      origin: RepairPlanAndHistoryDataSorted[],
                                      value: number,
                                      type: 'plan' | 'history') => {
    let index = origin.findIndex(value2 => value2.date.isSame(date));
    if (index < 0) {
        let splice_index = 0; // 设置插入新日期的位置
        if (origin.length === 0 || origin[origin.length - 1].date.isBefore(date)) {
            origin.push({
                    date: date,
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
                        date: date,
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
};

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
    is_time: boolean;
}


export interface RepairPlanAndHistoryDataSorted {
    date: moment.Moment;
    repair_plan_data_index_on_this_day: { plan_number_id: number, history_number_id: number | null, is_manual: boolean }[];
    repair_history_data_index_on_this_day: number[];
    repair_history_data_not_map_in_plan: number[];
}

export interface RepairHistoryCollectStoreInterface {
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
    side_nav_settings: {
        opened_date_index: moment.Moment[]; // 侧边栏中哪些日期默认打开
        which_sidenav_open: 'date_select' | 'date_list' | ''; // 打开哪个侧边栏
    };
    content_settings: {
        not_displayed_data: moment.Moment[]; // 哪些日期在多日期展示模式下屏蔽
        displayed_data: moment.Moment; // 哪个日期在单日期展示下呈现
        only_show_on_day_on_content: boolean;
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
    id?: number;
    used_number: string;
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


export type RepairHistoryCollectStoreActionType = SwitchOpenWhichSidebar
    | UpdateWhichDateShouldDisplayOnContent // 复制此行到ActionType中,更新哪些日期可以在页面中显示 action type
    | SwitchOnlyShowOneDateOnContent // 复制此行到ActionType中,切换是否仅在内容框中显示一个日期 action type
    | MapPlanAndHistoryNumber   // 复制此行到ActionType中
    | AddOrRemoveDateToOpenedDatePanel   // 复制此行到ActionType中
    | UpdateRepairHistoryData // 复制此行到ActionType中,更新天窗修历史实绩集合 action type
    | ChangeSelectedDate
    | SwitchGetHistoryDataPending // 复制此行到ActionType中
    | SwitchShowAllDatesOnDatesHeader   // 复制此行到ActionType中
    | UpdateRepairData // 复制此行到ActionType中
    | SwitchPendingRepairPlan   // 复制此行到ActionType中
    ;
export const RepairHistoryCollectStoreActions = {
    UpdateWhichDateShouldDisplayOnContent,  // 复制此行到导出的Action中,更新哪些日期可以在页面中显示 actions
    SwitchOnlyShowOneDateOnContent,  // 复制此行到导出的Action中,切换是否仅在内容框中显示一个日期 actions
    MapPlanAndHistoryNumber,  // 复制此行到导出的Action中
    UpdateRepairHistoryData,  // 复制此行到导出的Action中,更新天窗修历史实绩集合 actions
    SwitchPendingRepairPlan,  // 复制此行到导出的Action中
    SwitchGetHistoryDataPending, // 复制此行到导出的Action中
    SwitchOpenWhichSidebar,
    ChangeSelectedDate,
    UpdateRepairData, // 复制此行到导出的Action中
    SwitchShowAllDatesOnDatesHeader,  // 复制此行到导出的Action中
    AddOrRemoveDateToOpenedDatePanel,  // 复制此行到导出的Action中
};


const default_state: RepairHistoryCollectStoreInterface = {
    repair_plan_and_history_sorted_by_date: [],
    start_date: null,
    end_date: null,
    repair_plan_data: [],
    pending: {repair_plan: false, repair_history: false},
    show_all_dates_on_dates_header: false,
    repair_history_data: [],
    side_nav_settings: {
        opened_date_index: [],
        which_sidenav_open: '',
    },
    content_settings: {
        not_displayed_data: [],
        only_show_on_day_on_content: false,
        displayed_data: null,
    }
};


export function reducer(state: RepairHistoryCollectStoreInterface = default_state,
                        action: RepairHistoryCollectStoreActionType): RepairHistoryCollectStoreInterface {
    switch (action.type) {
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
            state.repair_plan_data.forEach(v => {
                add_a_value_to_sorted_object(v.post_date, date_array, v.id, 'plan');
            });
            state.repair_history_data.forEach(v => {
                add_a_value_to_sorted_object(v.date, date_array, v.id, 'history');
            });
            // 提取所有需要的date对象
            for (const single_date of date_array) {
                const not_include_history_data: number[] = [];
                for (const i of single_date.repair_plan_data_index_on_this_day) {
                    const plan_number = state.repair_plan_data.find(index => index.id === i.plan_number_id).number;
                    if (i.is_manual) {
                        // 对人工匹配的项目不进行干预
                    } else {
                        for (const history_id of single_date.repair_history_data_index_on_this_day) {
                            const history_index = state.repair_history_data.findIndex(value => value.id === history_id);
                            if (state.repair_history_data[history_index].used_number === plan_number) {
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
            return {...state, repair_history_data: action.payload}; // 复制此两行到reducer中,更新天窗修历史实绩集合 reducer

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
        case
        UPDATE_REPAIR_DATA:
            return {...state, repair_plan_data: action.payload.data}; // 复制此两行到reducer中
        default:
            return state;
    }
}

export default reducer;
