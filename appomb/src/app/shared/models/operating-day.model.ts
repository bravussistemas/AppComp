export class OperatingDay {
  id: number;
  weekday: number;
  open_time: string;
  close_time: string;
  lunch_time_start: string;
  lunch_time_end: string;
  is_closed: boolean;
  get_weekday_display: string;
}