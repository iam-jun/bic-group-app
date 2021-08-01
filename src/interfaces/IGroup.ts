import {IAction} from '~/constants/commonActions';

export interface IGroup {
  id: number;
  name: string;
  userCount?: number;
  parent?: any;
  parentId?: number;
  children?: IGroup[];
  icon?: string;
  parent_id?: number;
  slug?: string;
  description?: string;
  level?: number;
  parents?: number[];
  owner_id?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;

  path?: string;
  treeData?: IGroup;
}

export interface IParsedGroup extends IGroup {
  uiId: string;
  parentUiId: string;
  childrenUiIds: string[];
  hide: boolean;
  uiLevel: number;
  isChecked: boolean;
  isCollapsing: boolean;
}

export interface IGroupDetail extends IGroup {
  cover?: string;
  privacy?: string;
  type?: string;
  verified?: boolean;
  description?: string;
}
