import { CreateTag } from '~/interfaces/ITag';
import IBaseState, { IBaseListState, InitStateType } from '~/store/interfaces/IBaseState';
import { createStore, resetStore } from '~/store/utils';
import addTag from './actions/addTag';
import deleteTag from './actions/deleteTag';
import { getCommunityTags } from './actions/getCommunityTags';

export interface ITagsController extends IBaseState {
  communityTags: {
    [idCommunity: string]: IBaseListState<string>;
  };
  loading: boolean;
  actions: {
    getCommunityTags: (idCommunity: string, isRefreshing?: boolean) => void;
    addTag: (idCommunity: string, tag: CreateTag) => void;
    deleteTag: (idCommunity: string, idTag: string) => void;
  };
}

export const initState: InitStateType<ITagsController> = {
  communityTags: {},
  loading: false,
};

const tagsControllerStore = (set, get): ITagsController => ({
  ...initState,
  actions: {
    getCommunityTags: getCommunityTags(set, get),
    addTag: addTag(set, get),
    deleteTag: deleteTag(set, get),
  },
  reset: () => resetStore(initState, set),
});

const useTagsControllerStore = createStore<ITagsController>(tagsControllerStore);

export default useTagsControllerStore;
