import { ITag } from '~/interfaces/ITag';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { createStore, resetStore } from '~/store/utils';
import addTags from './actions/addTags';

export interface ITagsState extends IBaseState {
    tags: {
        [id: string]: ITag
    },
    actions: {
        addTags: (data: ITag | ITag[]) => void;
    }
}

const initState: InitStateType<ITagsState> = {
  tags: {},
};

const tagsStore = (set, get): ITagsState => ({
  ...initState,
  actions: {
    addTags: addTags(set, get),
  },
  reset: () => resetStore(initState, set),
});

const useTagsStore = createStore<ITagsState>(tagsStore);

export default useTagsStore;
