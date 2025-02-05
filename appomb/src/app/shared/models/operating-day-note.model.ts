export class OperatingDaysNote {
  id?: number;
  store?: number;
  day?: string;
  message: string;
  repeat?: boolean;
  repeat_period?: string;
  get_repeat_period_display?: string;
  user_can_dismiss?: boolean;
  note_type?: number;
  image?: string;
  url_image?: string;
  app_version_to_update?: string;
  is_app_update_notice?: boolean;
  is_visible?: boolean;
  show_unique?: boolean;
  title: string;
  is_video?: boolean;
  url_video?: string;
}
