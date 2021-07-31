export interface IGroup {
  id: number;
  name: string;
  userCount?: number;
  parent?: any;
  parentId?: number;
  children?: IGroup[];
  type?: any;
  icon?: string;
}

export interface IGroupDetail extends IGroup {
  background_img_url?: string;
  privacy?: string;
  group_type?: string;
  verified?: boolean;
  description?: string;
}
