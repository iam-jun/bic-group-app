import { CreateTag, EditTag } from '~/interfaces/ITag';
import IBaseState, { IBaseListState, InitStateType } from '~/store/interfaces/IBaseState';
import { createStore, resetStore } from '~/store/utils';
import createTag from './actions/createTag';
import editTag from './actions/editTag';
import deleteTag from './actions/deleteTag';
import { getCommunityTags } from './actions/getCommunityTags';

export interface ITagsController extends IBaseState {
  communityTags: {
    [idCommunity: string]: IBaseListState<string>;
  };
  loading: boolean;
  actions: {
    getCommunityTags: (idCommunity: string, isRefreshing?: boolean) => void;
    createTag: (idCommunity: string, tag: CreateTag) => void;
    editTag: (tag: EditTag) => void;
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
    createTag: createTag(set, get),
    editTag: editTag(set, get),
    deleteTag: deleteTag(set, get),
  },
  reset: () => resetStore(initState, set),
});

const useTagsControllerStore = createStore<ITagsController>(tagsControllerStore);

export default useTagsControllerStore;
