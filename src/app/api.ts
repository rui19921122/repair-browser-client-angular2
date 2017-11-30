import * as moment from 'moment';

export interface SystemUserInterface {
  username: string;
  department: string;
  message: string;
  department_username: string;
  department_password: string;
}

export interface RepairPlanContentInterface {
  extra_message: string;
  work_project: string;
  work_department: string;
  off_power_unit: string;
  work_detail: string;
  protect_mileage: string;
  operate_track_switch: string;
  work_place: string;
  work_with_department: string;
  on_duty_person: string;
  work_vehicle: string;
}

export interface RepairPlanSingleDataApiInterface {

  type: 'Ⅰ' | 'Ⅱ' | '站' | '垂';
  plan_time: string;
  apply_place: string;
  area: string;
  content: RepairPlanContentInterface[];
  number: string;
  direction: string;
  post_date: string;

}

export interface RepairPlanApi {
  length: number;
  data: RepairPlanSingleDataApiInterface[];
}

export interface RepairHistoryDataSingleApiInterface {
  date: string | moment.Moment;
  repair_content: string;
  number: string;
  plan_type: string;
  repair_department: string;
  inner_id: string;
  use_paper: boolean;
  apply_place: string;
  plan_time: string;
  id?: number;
}

export interface RepairHistoryDataApiInterface {
  data: RepairHistoryDataSingleApiInterface[];
}

export interface SaveDateToServerContentInterface {
  number: string;
  plan_start_time: moment.Moment;
  plan_end_time: moment.Moment;
  canceled: boolean;
  manual: boolean;
  actual_start_time: moment.Moment;
  actual_end_time: moment.Moment;
  actual_start_number: string;
  actual_end_number: string;
  person: string;

}

export interface SaveDataToServerApiInterface {
  data: {
    date: string,
    contents: SaveDateToServerContentInterface[]
  }[];
}

export interface QueryDataConflictFromServerRequestApi {
  data: {
    date: string[]
  };
}

export interface QueryDataConflictFromServerResponseApi {
  data: {
    date_post: { date: string; conflict: 'true' | 'false' }[];
  };
}

