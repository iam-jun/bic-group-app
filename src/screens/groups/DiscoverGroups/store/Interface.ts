import { IPayloadGetDiscoverGroups } from '~/interfaces/ICommunity';
import IBaseStore from '~/store/interfaces/IBaseStore';
import IFetchingStore from '~/store/interfaces/IFetchingStore';

interface IDiscoverGroupsState extends IBaseStore, IFetchingStore {
    loading: boolean,
    ids: any[],
    items: any,
    canLoadMore: boolean,
    noGroupInCommuntity: boolean,
    doSetGroupStatus?: (groupId: string, status: number) => void,
    doJoinNewGroup?: (groupId: string) => void,
    doCancelJoinGroup?: (groupId: string) => void,
    doGetDiscoverGroups?: (payload: IPayloadGetDiscoverGroups) => void,
    doGetCommunityGroups?: (communityId: string) => void;
}

export default IDiscoverGroupsState;
