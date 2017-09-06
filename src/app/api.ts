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

export interface RepairPlanSingleDataInterface {

  type: string;
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
  data: RepairPlanSingleDataInterface[];
}
