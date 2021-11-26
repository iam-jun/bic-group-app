export interface IAddWorkExperienceReq {
  company: string;
  title_position: string;
  location?: string;
  description?: string;
  currently_work_here?: boolean;
  start_date?: string;
  end_date?: string | null;
}
