import {Action, ActionReducer, Store, ActionReducerMap} from '@ngrx/store';
import {UserStoreInterface, reducer as user_reducer} from '../services/user.service';
import {StoreRouterConnectingModule, routerReducer} from '@ngrx/router-store';
import {
  RepairHistoryCollectStoreInterface,
  reducer as repair_history_collect_reducer
} from './repair-history-collect/repair-history-collect.store';
import {
  RepairHistoryQueryStoreInterface,
  reducer as repair_history_query_reducer
} from './reapir-history-query/store/repair-history-query.store';

export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';
export const RESET = 'RESET';


export interface AppState {
  user: UserStoreInterface;
  routerReducer: any;
  repair_history_collect: RepairHistoryCollectStoreInterface;
  repair_history_query: RepairHistoryQueryStoreInterface;
}

export const store: ActionReducerMap<AppState> = {
  user: user_reducer,
  routerReducer: routerReducer,
  repair_history_collect: repair_history_collect_reducer,
  repair_history_query: repair_history_query_reducer,
};
