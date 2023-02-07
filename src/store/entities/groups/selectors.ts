import { IGroupDetail } from '~/interfaces/IGroup';
import { IGroupsState } from './index';

const groupsSelector = {
  getGroup:
    (id: string, defaultValue?: any) => (state: IGroupsState) => (state?.groups?.[id] || defaultValue) as IGroupDetail,
};

export default groupsSelector;
