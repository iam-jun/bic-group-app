import streamApi from '~/api/StreamApi';
import appConfig from '~/configs/appConfig';
import { IParamGetCommunityTags, ITag } from '~/interfaces/ITag';
import useCommunitiesStore from '~/store/entities/communities';
import useTagsStore from '~/store/entities/tags';
import { ITagsController } from '..';

export const getCommunityTags = (set, get) => async (idCommunity: string, isRefreshing?: boolean) => {
  try {
    const { communityTags }: ITagsController = get();
    const community = useCommunitiesStore.getState().data[idCommunity];
    let communityTagsById = communityTags[idCommunity];

    if (!communityTagsById) {
      const initCommunityTags = {
        ids: [],
        loading: false,
        refreshing: false,
        hasNextPage: true,
      };
      set(
        (state: ITagsController) => {
          state.communityTags[idCommunity] = initCommunityTags;
        },
        'getCommunityTagsInit',
      );
      communityTagsById = initCommunityTags;
    }

    const {
      ids, loading, hasNextPage, refreshing,
    } = communityTagsById;

    if ((!isRefreshing && !hasNextPage) || loading || refreshing) return;

    set(
      (state: ITagsController) => {
        state.communityTags[idCommunity].loading = !isRefreshing;
        state.communityTags[idCommunity].refreshing = isRefreshing;
      },
      'getCommunityTagsFetching',
    );

    const params: IParamGetCommunityTags = {
      limit: appConfig.recordsPerPage,
      offset: isRefreshing ? 0 : ids.length,
      groupIds: [community.groupId],
    };

    const response = await streamApi.getTags(params);

    if (!response.data) {
      throw new Error('Incorrect response');
    }

    const { list, meta } = response.data;
    const { total } = meta;
    const lstIdTags = [];

    list.forEach((item: ITag) => {
      useTagsStore.getState().actions.addTags(item);
      lstIdTags.push(item.id);
    });

    set(
      (state: ITagsController) => {
        const newCommunityTagIds = isRefreshing ? lstIdTags : ids.concat(lstIdTags);
        state.communityTags[idCommunity].loading = false;
        state.communityTags[idCommunity].refreshing = false;
        state.communityTags[idCommunity].ids = newCommunityTagIds;
        state.communityTags[idCommunity].hasNextPage = newCommunityTagIds.length < total;
      },
      'getCommunityTagsSuccess',
    );
  } catch (e) {
    console.error('getCommunityTags error', e);
    set(
      (state: ITagsController) => {
        state.communityTags[idCommunity].loading = false;
        state.communityTags[idCommunity].refreshing = false;
      },
      'getCommunityTagsError',
    );
  }
};
