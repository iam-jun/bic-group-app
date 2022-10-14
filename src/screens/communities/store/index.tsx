import { CommunityPrivacyType } from '~/constants/privacyTypes';
import { ICommunityDetailEdit } from '~/interfaces/ICommunity';
import {
  createStore,
} from '~/store/utils';
import cancelJoinCommunity from './actions/cancelJoinCommunity';
import editCommunityDetail from './actions/editCommunityDetail';
import joinCommunity from './actions/joinCommunity';
import leaveCommunity from './actions/leaveCommunity';
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
  }
}

const communityController = (set, get) => ({
  actions: {
    leaveCommunity: leaveCommunity(set, get),
    joinCommunity: joinCommunity(set, get),
    cancelJoinCommunity: cancelJoinCommunity(set, get),
    editCommunityDetail: editCommunityDetail(set, get),
    updateCommunityJoinSetting: updateCommunityJoinSetting(set, get),
  },
});

const useCommunityController = createStore<ICommunityController>(communityController);

export default useCommunityController;
