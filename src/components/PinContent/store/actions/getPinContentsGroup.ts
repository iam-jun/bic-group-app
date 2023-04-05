import { isEmpty } from 'lodash';
import streamApi from '~/api/StreamApi';
import { IPinContentState } from '../index';
import showToastError from '~/store/helper/showToastError';
import { timeOut } from '~/utils/common';
import usePostsStore from '~/store/entities/posts';

const getPinContentsGroup = (set, get) => async (id: string) => {
  const { actions, groupPinContent }: IPinContentState = get();

  if (id && isEmpty(groupPinContent[id])) {
    actions.initDataPinContentsGroup(id);
  }

  try {
    set((state: IPinContentState) => {
      state.groupPinContent[id].isLoading = true;
    }, 'getPinContentsGroup');

    const response = await streamApi.getPinContentsGroup(id);
    await timeOut(200);

    const result = response.data || [];
    usePostsStore.getState().actions.addToPosts({ data: result });

    const ids = result.map((item) => item.id);
    set((state: IPinContentState) => {
      state.groupPinContent[id].isLoading = false;
      state.groupPinContent[id].data = ids;
    }, 'getPinContentsGroup success');
  } catch (e) {
    set((state: IPinContentState) => {
      state.groupPinContent[id].isLoading = false;
    }, 'getPinContentsGroup fail');
    console.error('\x1b[31m🐣️ action getPinContentsGroup error: ', e, '\x1b[0m');
    showToastError(e);
  }
};

export default getPinContentsGroup;
