import { IGroupDetailEdit, IGroupImageUpload } from '~/interfaces/IGroup';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { createStore } from '~/store/utils';
import editGroupDetail from './actions/editGroupDetail';
import uploadImage from './actions/uploadImage';

export interface IGroupPreview {
  id: string;
  name: string;
}

export interface IGroupBadgePreview {
  id: string;
  name: string;
  iconUrl: string;
}

export interface IGroupSetPreview {
  id: string;
  name: string;
}

export enum TypePrivacyImpact {
  DEFAULT_GROUP_SET_AND_MEMBERSHIP_APPROVAL = 'default_group_set_and_membership_approval',
  MEMBERSHIP_APPROVAL = 'membership_approval',
  DEFAULT_GROUP_SET = 'default_group_set',
  DEFAULT_GROUP_SET_AND_BADGE = 'default_group_set_and_badge',
  BADGE = 'badge',
}

export interface IGeneralInformationState extends IBaseState {
  loadingAvatar: boolean;
  loadingCover: boolean;
  affectedInnerGroupsMembershipApproval: IGroupPreview[];
  badge: IGroupBadgePreview | null;
  defaultGroupSet: IGroupSetPreview | null;
  typePrivacyImpact: TypePrivacyImpact;
  actions: {
    setLoadingAvatar: (payload: boolean) => void;
    setLoadingCover: (payload: boolean) => void;
    editGroupDetail: (data: IGroupDetailEdit, callback?: () => void) => Promise<void>;
    uploadImage: (payload: IGroupImageUpload) => void;
    clearPreviewPrivacy: () => void;
  };
}

const initialState: InitStateType<IGeneralInformationState> = {
  loadingAvatar: false,
  loadingCover: false,
  affectedInnerGroupsMembershipApproval: [],
  badge: null,
  defaultGroupSet: null,
  typePrivacyImpact: null,
};

const generalInformationStore = (set, get) => ({
  ...initialState,
  actions: {
    editGroupDetail: editGroupDetail(set, get),
    uploadImage: uploadImage(set, get),
    setLoadingAvatar: (payload: boolean) => {
      set((state: IGeneralInformationState) => {
        state.loadingAvatar = payload;
      }, 'setLoadingAvatar');
    },
    setLoadingCover: (payload: boolean) => {
      set((state: IGeneralInformationState) => {
        state.loadingCover = payload;
      }, 'setLoadingCover');
    },
    clearPreviewPrivacy: () => {
      set((state: IGeneralInformationState) => {
        state.affectedInnerGroupsMembershipApproval = initialState.affectedInnerGroupsMembershipApproval;
        state.badge = initialState.badge;
        state.defaultGroupSet = initialState.defaultGroupSet;
        state.typePrivacyImpact = initialState.typePrivacyImpact;
      }, 'clearPreviewPrivacy');
    },
  },
});

const useGeneralInformationStore = createStore<IGeneralInformationState>(generalInformationStore);

export default useGeneralInformationStore;
