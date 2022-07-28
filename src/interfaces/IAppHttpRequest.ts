export interface IParamsGetUsers {
  key?: string;
  offset?: number;
  limit?: number;
  sort?: 'id:asc' | 'id:desc' | 'id:asc,createdAt:desc' | string;
  userIds?: string;
}
