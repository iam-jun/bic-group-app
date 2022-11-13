import IBaseState from '~/store/interfaces/IBaseState';
import IFetchingState from '~/store/interfaces/IFetchingState';

interface IUserInterestedPostState extends IBaseState, IFetchingState {
  data: any[];
  getUsersInterestedPost?: (postId: string) => void;
}

export default IUserInterestedPostState;
