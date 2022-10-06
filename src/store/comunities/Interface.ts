import { CommunityPrivacyType } from '~/constants/privacyTypes';
import { IObject } from '~/interfaces/common';
import { ICommunity, ICommunityDetailEdit } from '~/interfaces/ICommunity';
import IBaseState from '../interfaces/IBaseState';

interface ICommunitiesState extends IBaseState {
    /**
        To handle fetching state.
        For example: loading, refreshings
    * */
    requestings: IObject<boolean>;
    data: IObject<ICommunity>;
    /**
     * Set currentCommunityId when call doGetCommunity
     * The screens in the same stack can access
     * through store (no need to set param when navigating)
     */
    currentCommunityId?: string;
    errors: IObject<any>;
    actions:{
      getCommunity: (id: string) => void;
      leaveCommunity?: (id: string, privacy: CommunityPrivacyType) => void;
      joinCommunity: (id: string, name: string) => void;
      cancelJoinCommunity: (id: string, name: string) => void;
      updateCommunityJoinSetting: (id: string, isJoinApproval: boolean) => void;
      editCommunityDetail: (
        data: ICommunityDetailEdit, editFieldName?: string, callback?: () => void
      ) => void;
      resetCommunity: (id: string) => void;
    }
}

export default ICommunitiesState;
