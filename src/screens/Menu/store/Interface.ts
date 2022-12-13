import { IUserEdit, IUserWorkExperience } from '~/interfaces/IAuth';
import { ICommunity } from '~/interfaces/ICommunity';
import IBaseState from '~/store/interfaces/IBaseState';

interface IMenuController extends IBaseState{
  data?: ICommunity[],
  loading: boolean,
  selectedWorkItem: IUserWorkExperience;

  actions: {
    getJoinedCommunities: (params?: {
    previewMembers?: boolean;
    managed?: boolean;
  }) => void;
    editMyProfile: (payload: {
      data: IUserEdit;
      editFieldToastMessage?: string;
      callback?: () => void;
  }) => void;

    setSelectedWorkItem: (payload: IUserWorkExperience | null) => void;
  }
}

export default IMenuController;
