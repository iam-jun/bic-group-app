import streamApi from '~/api/StreamApi';
import { CreateTag } from '~/interfaces/ITag';
import useTagsStore from '~/store/entities/tags';
import { ITagsController } from '..';
import showToastSuccess from '~/store/helper/showToastSuccess';
import showToastError from '~/store/helper/showToastError';

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

    const { data } = response;

    useTagsStore.getState().actions.addTags(data);

    set(
      (state: ITagsController) => {
        const initCommunityTags = {
          ids: [],
          loading: false,
          refreshing: false,
          hasNextPage: true,
        };

        let currentCommunityTags = state.communityTags[idCommunity];
        if (!currentCommunityTags) {
          currentCommunityTags = initCommunityTags;
        }
        currentCommunityTags.ids.push(data.id);

        state.communityTags[idCommunity] = currentCommunityTags;
        state.loading = false;
      },
      'addTagSuccess',
    );

    showToastSuccess(response);
  } catch (e) {
    console.error('addTag error', e);
    set(
      (state: ITagsController) => {
        state.loading = false;
      },
      'addTagFailed',
    );

    showToastError(e);
  }
};

export default createTag;
