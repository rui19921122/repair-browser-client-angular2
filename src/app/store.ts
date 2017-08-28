import {Action, ActionReducer} from '@ngrx/store';

export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';
export const RESET = 'RESET';

export function stateSetter(reducer: ActionReducer<any>): ActionReducer<any> {
  return function (state: any, action: any) {
    if (action.type === 'SET_ROOT_STATE') {
      console.log('dispatch SET_ROOT_STATE');
      return action.payload;
    }
    return reducer(state, action);
  };
}


export function counterReducer(state: number = 0, action: Action) {
  switch (action.type) {
    case INCREMENT:
      return state + 1;

    case DECREMENT:
      return state - 1;

    case RESET:
      return 0;

    default:
      return state;
  }
}

export const store = {
  count: counterReducer
};

export const metaReducers: ActionReducer<any, any>[] = [stateSetter];
