import streamApi from '~/api/StreamApi';
import { IToastMessage } from '~/interfaces/common';
import modalActions from '~/storeRedux/modal/actions';
import Store from '~/storeRedux';
import { ITagsController } from '..';

const deleteTag = (set, get) => async (idCommunity: string, idTag: string) => {
  try {
    const { loading }: ITagsController = get();

    if (loading) return;

    const response = await streamApi.deleteTag(idTag);

    const { meta } = response;

    set(
      (state: ITagsController) => {
        const newLstIdTags = state.communityTags[idCommunity].ids.filter((id) => id !== idTag);
        state.communityTags[idCommunity].ids = newLstIdTags;
      },
      'deleteTagSuccess',
    );

    const toastMessage: IToastMessage = {
      content: meta?.message,
    };
    Store.store.dispatch(modalActions.showHideToastMessage(toastMessage));
  } catch (e) {
    console.error('deleteTag error', e);

    const toastMessage: IToastMessage = {
      content: e?.meta?.message,
      props: { type: 'error' },
    };
    Store.store.dispatch(modalActions.showHideToastMessage(toastMessage));
  }
};

export default deleteTag;
