import { IGroup } from '~/interfaces/IGroup';
import IBaseStore from '~/store/interfaces/IBaseStore';

interface ICommunityJoinedGroupTreeState extends IBaseStore {
  data: {[key: string]: IGroup[]},
  loading: boolean,
  searchKey: string,
  searchResult: IGroup[],

  actions: {
    setSearchKey: (key: string) => void,
    getJoinedGroupTree: (communityId: string) => void,
    getJoinedGroupSearch: (communityId: string, key: string) => void,
  }
}

export default ICommunityJoinedGroupTreeState;
