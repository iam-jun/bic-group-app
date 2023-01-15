import streamApi from '~/api/StreamApi';
import { IToastMessage } from '~/interfaces/common';
import { EditTag } from '~/interfaces/ITag';
import useTagsStore from '~/store/entities/tags';
import { ITagsController } from '..';
import Store from '~/storeRedux';
import modalActions from '~/storeRedux/modal/actions';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';

const navigation = withNavigation(rootNavigationRef);

export const editTag = (set, get) => async (tag: EditTag) => {
  try {
    const { loading }: ITagsController = get();

    if (loading) return;

    set(
      (state: ITagsController) => {
        state.loading = true;
      },
      'editTagLoading',
    );

    const response = await streamApi.editTag(tag);

    if (!response.data) {
      throw new Error('incorrect response');
    }

    const { data, meta } = response;

    useTagsStore.getState().actions.addTags(data);

    set(
      (state: ITagsController) => {
        state.loading = false;
      },
      'editTagSuccess',
    );

    const toastMessage: IToastMessage = {
      content: meta?.message,
    };
    Store.store.dispatch(modalActions.showHideToastMessage(toastMessage));
    navigation.goBack();
  } catch (e) {
    console.error('editTag error', e);
    set(
      (state: ITagsController) => {
        state.loading = false;
      },
      'editTagFailed',
    );

    const toastMessage: IToastMessage = {
      content: e?.meta?.message,
      props: { type: 'error' },
    };
    Store.store.dispatch(modalActions.showHideToastMessage(toastMessage));
  }
};

export default editTag;
