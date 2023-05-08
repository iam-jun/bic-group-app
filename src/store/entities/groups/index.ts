import { IObject } from '~/interfaces/common';
import { IGroupDetail } from '~/interfaces/IGroup';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { createStore } from '~/store/utils';
import addToGroups from './actions/addToGroups';

export interface IGroupsState extends IBaseState {
  groups: IObject<IGroupDetail>;
  currentGroupId: string;

  actions: {
    addToGroups: (payload: IGroupDetail) => void;
  };
}

const initState: InitStateType<IGroupsState> = {
  groups: {},
  currentGroupId: '',
};

const groupsStore = (set, get) => ({
  ...initState,

  actions: {
    addToGroups: addToGroups(set, get),
  },
});

const useGroupsStore = createStore<IGroupsState>(groupsStore);

export default useGroupsStore;
