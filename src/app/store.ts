import {Action, ActionReducer, Store} from '@ngrx/store';

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

export const store = {
  count: counterReducer
};

declare const window: any;
