import {Action} from '@ngrx/store';

export const SWITCH_OPEN_PANEL = '[history]SWITCH_OPEN_PANEL';


export class SwitchOpenPanel implements Action {
  readonly type = SWITCH_OPEN_PANEL;

  constructor(public payload: boolean) {
  }
}

export type RepairHistoryCollectStoreActionType = SwitchOpenPanel;
export const RepairHistoryCollectStoreActions = {
  SwitchOpenPanel
};

export interface RepairHistoryCollectStoreInterface {
  open_select_panel: boolean;
}

const default_state: RepairHistoryCollectStoreInterface = {
  open_select_panel: true,
};

export function reducer(state: RepairHistoryCollectStoreInterface = default_state, action: RepairHistoryCollectStoreActionType) {
  switch (action.type) {
    case SWITCH_OPEN_PANEL:
      return action.payload;
    default:
      return state;
  }
}

export default reducer;
