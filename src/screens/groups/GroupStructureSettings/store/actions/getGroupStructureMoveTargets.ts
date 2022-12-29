import groupApi from '~/api/GroupApi';
import { IPayloadGetGroupStructureMoveTargets } from '~/interfaces/IGroup';
import showToastError from '~/store/helper/showToastError';
import IGroupStructureState from '../Interface';

const getGroupStructureMoveTargets = (set, get) => async (payload: IPayloadGetGroupStructureMoveTargets) => {
  const { communityId, groupId, key } = payload;
  const data: IGroupStructureState = get();
  const { targetGroups, movingGroup } = data?.move || {};
  try {
    set((state: IGroupStructureState) => {
      state.move.loading = true;
      state.move.targetGroups = targetGroups;
      state.move.movingGroup = movingGroup;
    }, 'getGroupStructureMoveTargets');

    const response = await groupApi.getCommunityStructureMoveTargets(communityId, groupId, key);

    set((state: IGroupStructureState) => {
      state.move.loading = false;
      state.move.targetGroups = response?.data?.targetGroups || {};
      state.move.movingGroup = response?.data?.movingGroup || {};
    }, 'getGroupStructureMoveTargetsSuccess');
  } catch (e) {
    set((state: IGroupStructureState) => {
      state.move.loading = false;
      state.move.targetGroups = targetGroups;
      state.move.movingGroup = movingGroup;
    }, 'getGroupStructureMoveTargetsError');
    console.error('\x1b[31m🐣️ action getGroupStructureMoveTargets error: ', e, '\x1b[0m');
    showToastError(e);
  }
};

export default getGroupStructureMoveTargets;
