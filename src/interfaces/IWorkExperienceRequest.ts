export interface IAddWorkExperienceReq {
  company: string;
  titlePosition: string;
  location?: string;
  description?: string;
  currentlyWorkHere?: boolean;
  startDate?: string;
  endDate?: string | null;
}
