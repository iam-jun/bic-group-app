import { IGetUserProfile, IUserProfile } from '~/interfaces/IAuth';
import IBaseState from '~/store/interfaces/IBaseState';

interface IUserProfileState extends IBaseState {
  loading: boolean;
  data: IUserProfile;
  error: any;

  doGetUserProfile: ({ userId, params }: IGetUserProfile) => void;
}

export default IUserProfileState;
