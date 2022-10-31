import { IUserEdit } from '~/interfaces/IAuth';
import { ICommunity } from '~/interfaces/ICommunity';
import IBaseState from '~/store/interfaces/IBaseState';

interface IMenuController extends IBaseState{
  data?: ICommunity[],
  loading: boolean,

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
  }
}

export default IMenuController;
