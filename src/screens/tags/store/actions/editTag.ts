import streamApi from '~/api/StreamApi';
import { EditTag } from '~/interfaces/ITag';
import useTagsStore from '~/store/entities/tags';
import { ITagsController } from '..';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import showToastSuccess from '~/store/helper/showToastSuccess';
import showToastError from '~/store/helper/showToastError';

const navigation = withNavigation?.(rootNavigationRef);

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

    const { data } = response;

    useTagsStore.getState().actions.addTags(data);

    set(
      (state: ITagsController) => {
        state.loading = false;
      },
      'editTagSuccess',
    );

    showToastSuccess(response);
    navigation.goBack();
  } catch (e) {
    console.error('editTag error', e);
    set(
      (state: ITagsController) => {
        state.loading = false;
      },
      'editTagFailed',
    );

    showToastError(e);
  }
};

export default editTag;
