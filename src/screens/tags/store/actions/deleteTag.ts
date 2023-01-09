import streamApi from '~/api/StreamApi';
import { ITagsController } from '..';
import showToastError from '~/store/helper/showToastError';
import showToastSuccess from '~/store/helper/showToastSuccess';

const deleteTag = (set, get) => async (idCommunity: string, idTag: string) => {
  try {
    const { loading }: ITagsController = get();

    if (loading) return;

    const response = await streamApi.deleteTag(idTag);

    set(
      (state: ITagsController) => {
        const newLstIdTags = state.communityTags[idCommunity].ids.filter((id) => id !== idTag);
        state.communityTags[idCommunity].ids = newLstIdTags;
      },
      'deleteTagSuccess',
    );

    showToastSuccess(response);
  } catch (e) {
    console.error('deleteTag error', e);

    showToastError(e);
  }
};

export default deleteTag;
