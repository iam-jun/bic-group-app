import streamApi from '~/api/StreamApi';
import { IToastMessage } from '~/interfaces/common';
import { CreateTag } from '~/interfaces/ITag';
import useTagsStore from '~/store/entities/tags';
import modalActions from '~/storeRedux/modal/actions';
import Store from '~/storeRedux';
import { ITagsController } from '..';

const createTag = (set, get) => async (idCommunity: string, tag: CreateTag) => {
  try {
    const { loading }: ITagsController = get();

    if (loading) return;

    set(
      (state: ITagsController) => {
        state.loading = true;
      },
      'addTagLoading',
    );

    const response = await streamApi.addTag(tag);

    if (!response.data) {
      throw new Error('incorrect response');
    }

    const { data, meta } = response;

    useTagsStore.getState().actions.addTags(data);

    set(
      (state: ITagsController) => {
        state.communityTags[idCommunity].ids.push(data.id);
        state.loading = false;
      },
      'addTagSuccess',
    );

    const toastMessage: IToastMessage = {
      content: meta?.message,
    };
    Store.store.dispatch(modalActions.showHideToastMessage(toastMessage));
  } catch (e) {
    console.error('addTag error', e);
    set(
      (state: ITagsController) => {
        state.loading = false;
      },
      'addTagFailed',
    );

    const toastMessage: IToastMessage = {
      content: e?.meta?.message,
      props: { type: 'error' },
    };
    Store.store.dispatch(modalActions.showHideToastMessage(toastMessage));
  }
};

export default createTag;
