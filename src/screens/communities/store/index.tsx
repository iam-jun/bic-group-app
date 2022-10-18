import { CommunityPrivacyType } from '~/constants/privacyTypes';
import { ICommunityDetailEdit } from '~/interfaces/ICommunity';
import {
  createStore,
} from '~/store/utils';
import assignCommunityAdmin from './actions/assignCommunityAdmin';
import cancelJoinCommunity from './actions/cancelJoinCommunity';
import editCommunityDetail from './actions/editCommunityDetail';
import joinCommunity from './actions/joinCommunity';
import leaveCommunity from './actions/leaveCommunity';
import revokeCommunityAdmin from './actions/revokeCommunityAdmin';
import updateCommunityJoinSetting from './actions/updateCommunityJoinSetting';

interface ICommunityController {
  actions: {
    leaveCommunity?: (id: string, privacy: CommunityPrivacyType) => void;
    joinCommunity: (id: string, name: string) => void;
    cancelJoinCommunity: (id: string, name: string) => void;
    updateCommunityJoinSetting: (id: string, isJoinApproval: boolean) => void;
    editCommunityDetail: (
      data: ICommunityDetailEdit, editFieldName?: string, callback?: () => void
    ) => void;
    assignCommunityAdmin: (id: string, userIds: string[]) => void;
    revokeCommunityAdmin: (id: string, userIds: string[]) => void;
  }
}

const communityController = (set, get) => ({
  actions: {
    leaveCommunity: leaveCommunity(set, get),
    joinCommunity: joinCommunity(set, get),
    cancelJoinCommunity: cancelJoinCommunity(set, get),
    editCommunityDetail: editCommunityDetail(set, get),
    updateCommunityJoinSetting: updateCommunityJoinSetting(set, get),
    assignCommunityAdmin: assignCommunityAdmin(set, get),
    revokeCommunityAdmin: revokeCommunityAdmin(set, get),
  },
});

const useCommunityController = createStore<ICommunityController>(communityController);

export default useCommunityController;
