export interface IParamsGetUsers {
  key?: string;
  offset?: number;
  limit?: number;
  sort?: 'id:asc' | 'id:desc' | 'id:asc,created_at:desc' | string;
  user_ids?: string;
}
