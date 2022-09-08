import { COMMUNITY_PRIVACY_TYPE } from '~/constants/privacyTypes';
import IBaseStore from '~/store/interfaces/IBaseStore';

interface ILeaveCommunityState extends IBaseStore {
  doPostLeaveCommunity?: (communityId: string, privacy: COMMUNITY_PRIVACY_TYPE) => void;
}

export default ILeaveCommunityState;
