import { IUserEdit, IUserWorkExperience } from '~/interfaces/IAuth';
import { ICommunity } from '~/interfaces/ICommunity';
import { IUserImageUpload } from '~/interfaces/IEditUser';
import IBaseState from '~/store/interfaces/IBaseState';

interface IMenuController extends IBaseState{
  data?: ICommunity[],
  loading: boolean,
  selectedWorkItem: IUserWorkExperience;
  editContactError: string;

  actions: {
    getJoinedCommunities: (params?: {
    previewMembers?: boolean;
    managed?: boolean;
  }) => void;
    editMyProfile: (payload: {
      data: IUserEdit;
      callback?: () => void;
  }) => void;
    uploadImage: (payload: IUserImageUpload, callback: () => void)=> void;

    setSelectedWorkItem: (payload: IUserWorkExperience | null) => void;
    setEditContactError: (errorText: string) => void;
  }
}

export default IMenuController;
