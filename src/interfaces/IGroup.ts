import {IAction} from '~/constants/commonActions';
import {PRIVACY_TYPE} from '~/constants/privacyTypes';

export interface IGroup {
  id: number;
  name: string;
  user_count?: number;
  parent?: any;
  parentId?: number;
  children?: IGroup[];
  icon?: string;
  parent_id?: number;
  slug?: string;
  description?: string;
  background_img_url?: string;
  privacy?: string;
  group_type?: string;
  verified?: boolean;
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

export interface IGroupDetailEdit {
  id?: number;
  parent_id?: number;
  name?: string;
  description?: string;
  level?: number;
  owner_id?: number;
  icon?: string;
  background_img_url?: string;
  group_type?: 'GENERIC' | 'COMMUNITY' | 'COMPANY';
  privacy?: PRIVACY_TYPE;
}
