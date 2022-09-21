import { IPayloadGetDiscoverGroups } from '~/interfaces/ICommunity';
import IBaseStore from '~/store/interfaces/IBaseStore';
import IFetchingStore from '~/store/interfaces/IFetchingStore';

interface IDiscoverGroupsState extends IBaseStore, IFetchingStore {
    loading: boolean,
    ids: any[],
    items: any,
    canLoadMore: boolean,
    noGroupInCommuntity: boolean,
    doGetDiscoverGroups?: (payload: IPayloadGetDiscoverGroups) => void,
    doGetCommunityGroups?: (communityId: string) => void;
}

export default IDiscoverGroupsState;
