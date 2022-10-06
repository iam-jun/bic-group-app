import { IPayloadGetDiscoverGroups } from '~/interfaces/ICommunity';
import IBaseState from '~/store/interfaces/IBaseState';
import IFetchingState from '~/store/interfaces/IFetchingState';

interface IDiscoverGroupsState extends IBaseState, IFetchingState {
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
