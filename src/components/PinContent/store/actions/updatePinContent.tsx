import { isEmpty } from 'lodash';
import streamApi from '~/api/StreamApi';
import APIErrorCode from '~/constants/apiErrorCode';
import showToastError from '~/store/helper/showToastError';
import {
  IPinContentState,
  UpdatePinContentParams,
  UpdateGroupPinContentParams,
} from '..';

const updatePinContent
  = (set, get) => async (params: UpdatePinContentParams) => {
    const { actions, pinAudiences }: IPinContentState = get();
    const {
      postId,
      pinGroupIds = [],
      unpinGroupIds = [],
      onSuccess,
      onError,
    } = params;
    try {
      set((state: IPinContentState) => {
        state.isLoading = true;
      });

      const res = await streamApi.updatePinContent(
        postId,
        pinGroupIds,
        unpinGroupIds,
      );

      set((state: IPinContentState) => {
        state.isLoading = false;
      }, 'updatePinContent success');

      const updateGroupPinContentParams: UpdateGroupPinContentParams = {
        postId,
        pinGroupIds,
        unpinGroupIds,
      };
      actions.updateGroupPinContent(updateGroupPinContentParams);
      onSuccess?.(res);
    } catch (e) {
      console.error('\x1b[35m🐣️ updatePinContent error: ', e, '\x1b[0m');
      set((state: IPinContentState) => {
        state.isLoading = false;
      }, 'updatePinContent failed');

      const { code } = e;
      if (
        (code === APIErrorCode.Post.CONTENT_NO_PIN_PERMISSION
          || code === APIErrorCode.Post.CONTENT_AUDIENCE_NO_BELONG)
        && !isEmpty(pinAudiences)
        && onError
      ) {
        onError(e);
        return;
      }
      showToastError(e);
    }
  };

export default updatePinContent;
