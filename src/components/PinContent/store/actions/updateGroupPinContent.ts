import { IPinContentState, UpdateGroupPinContentParams, PinContent } from '..';

const updateGroupPinContent = (set, get) => async (params: UpdateGroupPinContentParams) => {
  try {
    const { postId, pinGroupIds = [], unpinGroupIds = [] } = params;

    pinGroupIds.forEach((groupId) => {
      const groupPinContent = (get() as IPinContentState).groupPinContent[groupId];
      let { data } = groupPinContent || {};

      if (data && !data.includes(postId)) {
        data.unshift(postId);
      }

      if (!data) {
        data = [postId];
      }

      const newGroupPinContent: PinContent = {
        isLoading: false,
        data,
      };

      set((state: IPinContentState) => {
        state.groupPinContent[groupId] = newGroupPinContent;
      }, 'updateGroupPinContent pinGroupIds');
    });

    unpinGroupIds.forEach((groupId) => {
      const groupPinContent = (get() as IPinContentState).groupPinContent[groupId];

      if (!groupPinContent) return;

      let { data } = groupPinContent || {};

      if (data) {
        data = data.filter((pinnedPostId) => pinnedPostId !== postId);
      }

      const newGroupPinContent: PinContent = {
        isLoading: false,
        data,
      };

      set((state: IPinContentState) => {
        state.groupPinContent[groupId] = newGroupPinContent;
      }, 'updateGroupPinContent unpinGroupIds');
    });
  } catch (e) {
    console.error('\x1b[35m🐣️ updatePinContent error: ', e, '\x1b[0m');
  }
};

export default updateGroupPinContent;
