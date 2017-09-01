import {Action} from '@ngrx/store';
import * as moment from 'moment';

export const SWITCH_OPEN_PANEL = '[history]SWITCH_OPEN_PANEL';
export const CHANGE_SELECTED_DATE = '[history]CHANGE_SELECTED_DATE';

export class ChangeSelectedDate implements Action {
  readonly type = CHANGE_SELECTED_DATE;

  constructor(public payload: { start_date: moment.Moment, end_date: moment.Moment }) {
  }
}


export class SwitchOpenPanel implements Action {
  readonly type = SWITCH_OPEN_PANEL;

  constructor(public payload: boolean) {
  }
}

export type RepairHistoryCollectStoreActionType = SwitchOpenPanel | ChangeSelectedDate;
export const RepairHistoryCollectStoreActions = {
  SwitchOpenPanel,
  ChangeSelectedDate,
};

export interface RepairHistoryCollectStoreInterface {
  open_select_panel: boolean;
  start_date?: moment.Moment;
  end_date?: moment.Moment;
}

const default_state: RepairHistoryCollectStoreInterface = {
  open_select_panel: true,
};

export function reducer(state: RepairHistoryCollectStoreInterface = default_state,
                        action: RepairHistoryCollectStoreActionType): RepairHistoryCollectStoreInterface {
  switch (action.type) {
    case SWITCH_OPEN_PANEL:
      return {...state, open_select_panel: action.payload};
    case CHANGE_SELECTED_DATE:
      return {...state, start_date: action.payload.start_date, end_date: action.payload.end_date};
    default:
      return state;
  }
}

export default reducer;
