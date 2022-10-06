import { createStore, resetStore } from '~/store/utils';
import getUsersInterestedPost from './action/getUsersInterestedPost';
import IUserInterestedPostState from './Interface';

const initState: IUserInterestedPostState = {
  data: [],
  loading: false,
  hasNextPage: true,
};

const userInterestedPostState = (set, get): IUserInterestedPostState => ({
  ...initState,
  getUsersInterestedPost: getUsersInterestedPost(set, get),
  reset: () => resetStore(initState, set),
});

const useUserInterestedPostStore = createStore<IUserInterestedPostState>(userInterestedPostState);

export default useUserInterestedPostStore;
