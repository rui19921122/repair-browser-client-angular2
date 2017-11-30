import * as moment from 'moment';

export interface RepairHistoryQueryGetDataListApi {
  data: {
    date: string; // 格式为YYYY-MM-DD
    contents: {
      number: string;
      plan_start_time: Date;
      actual_start_time: Date;
      plan_end_time: string;
      actual_end_time: string;
      canceled: boolean;
      manual: boolean;
      repair_type: string;
      actual_start_number: string;
      actual_end_number: string;
      person: string;
      date: Date;
      department: string;
    }[]
  }[];
}
