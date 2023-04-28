import { IPayloadGetDiscoverGroups, MembershipAnswerRequest } from '~/interfaces/ICommunity';
import IBaseState from '~/store/interfaces/IBaseState';
import IFetchingState from '~/store/interfaces/IFetchingState';

interface IDiscoverGroupsState extends IBaseState, IFetchingState {
    loading: boolean,
    ids: any[],
    items: any,
    canLoadMore: boolean,
    noGroupInCommuntity: boolean,
    actions: {
        setGroupStatus?: (groupId: string, status: number) => void,
        joinNewGroup?: (groupId: string, membershipAnswers?: MembershipAnswerRequest[],) => void,
        cancelJoinGroup?: (groupId: string) => void,
        getDiscoverGroups?: (payload: IPayloadGetDiscoverGroups) => void,
    }
}

export default IDiscoverGroupsState;
