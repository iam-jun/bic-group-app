import { IPinContentState, UpdateGroupPinContentParams, PinContent } from '..';

const updateGroupPinContent = (set, get) => async (params: UpdateGroupPinContentParams) => {
  try {
    const { postId, pinGroupIds = [], unpinGroupIds = [] } = params;

    pinGroupIds.forEach((groupId) => {
      const groupPinContent = (get() as IPinContentState).groupPinContent[groupId];
      const { data } = groupPinContent || {};
      const newData = data ? [...data] : [];

      if (newData && !newData.includes(postId)) {
        newData.unshift(postId);
      }

      const newGroupPinContent: PinContent = {
        isLoading: false,
        data: newData,
      };

      set((state: IPinContentState) => {
        state.groupPinContent[groupId] = newGroupPinContent;
      }, 'updateGroupPinContent pinGroupIds');
    });

    unpinGroupIds.forEach((groupId) => {
      const groupPinContent = (get() as IPinContentState).groupPinContent[groupId];

      if (!groupPinContent) return;

      const { data } = groupPinContent;
      let newData = data ? [...data] : [];

      newData = newData.filter((pinnedPostId) => pinnedPostId !== postId);

      const newGroupPinContent: PinContent = {
        isLoading: false,
        data: newData,
      };

      set((state: IPinContentState) => {
        state.groupPinContent[groupId] = newGroupPinContent;
      }, 'updateGroupPinContent unpinGroupIds');
    });
  } catch (e) {
    console.error('\x1b[35m🐣️ updateGroupPinContent error: ', e, '\x1b[0m');
  }
};

export default updateGroupPinContent;
