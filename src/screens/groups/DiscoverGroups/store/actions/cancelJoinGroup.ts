import groupJoinStatus from '~/constants/groupJoinStatus';
import IDiscoverGroupsState from '../Interface';
import Store from '~/storeRedux';
import groupsActions from '~/storeRedux/groups/actions';

const cancelJoinGroup = (set, get) => async (groupId: string) => {
  try {
    const currentState: IDiscoverGroupsState = get();
    const currentRequestState = currentState.items[groupId]?.joinStatus || 0;
    if (currentRequestState === groupJoinStatus.member) return;
    const groupName = currentState.items[groupId]?.name;

    Store.store.dispatch(groupsActions.cancelJoinGroup({ groupId, groupName }));
    const currentItem = {
      ...currentState.items[groupId],
      joinStatus: groupJoinStatus.visitor,
    };
    set((state:IDiscoverGroupsState) => {
      state.items[groupId] = { ...currentItem };
    }, 'cancelJoinGroupSuccess');
  } catch (err) {
    console.error('cancelJoinGroup error', err);
  }
};

export default cancelJoinGroup;
