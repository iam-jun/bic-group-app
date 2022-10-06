import { IGroup } from '~/interfaces/IGroup';
import IBaseState from '~/store/interfaces/IBaseState';

interface ICommunityJoinedGroupTreeState extends IBaseState {
  data: {[key: string]: IGroup[]},
  loading: boolean,
  searchKey: string,
  searchResult: IGroup[],
  searchHasNextPage: boolean,

  actions: {
    setSearchKey: (key: string) => void,
    getJoinedGroupTree: (communityId: string) => void,
    getJoinedGroupSearch: (communityId: string, key: string, isLoadMore?: boolean) => void,
  }
}

export default ICommunityJoinedGroupTreeState;
