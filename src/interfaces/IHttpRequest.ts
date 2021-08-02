export interface IPaginationParams {
  offset: number;
  count: number;
  sort?: {[x: string]: string | number};
}

export interface ICreateRoomReq {
  name: string;
  members: string[];
  customFields?: {
    type: string;
    beinGroupId?: string;
    [x: string]: any;
  };
  readOnly?: boolean;
}
