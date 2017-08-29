import {Action, ActionReducer, Store} from '@ngrx/store';
import {UserStoreInterface, reducer as user_reducer} from './user.service';
import {StoreRouterConnectingModule, routerReducer} from '@ngrx/router-store';

export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';
export const RESET = 'RESET';

export function counterReducer(state: number = 0, action: Action) {
  switch (action.type) {
    case INCREMENT:
      return state + 1;
    case DECREMENT:
      return state - 1;
    case RESET:
      return 0;
    case 'SET_ROOT_STATE':
      return 1111;
    default:
      return state;
  }
}

export interface AppState {
  user: UserStoreInterface;
  routerReducer: any;
}

export const store = {
  user: user_reducer,
  routerReducer: routerReducer
};
