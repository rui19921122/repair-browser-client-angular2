import {Action, ActionReducer, Store} from '@ngrx/store';
import {UserStoreInterface, reducer as user_reducer} from './user.service';
import {StoreRouterConnectingModule, routerReducer} from '@ngrx/router-store';
import {
  RepairHistoryCollectStoreInterface,
  reducer as repair_history_collect_reducer
} from './repair-history-collect/repair-history-collect.store';

export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';
export const RESET = 'RESET';


export interface AppState {
  user: UserStoreInterface;
  routerReducer: any;
  repair_history_collect: RepairHistoryCollectStoreInterface;
}

export const store = {
  user: user_reducer,
  routerReducer: routerReducer,
  repair_history_collect: repair_history_collect_reducer,
};
