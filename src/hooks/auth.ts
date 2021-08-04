import {useSelector} from 'react-redux';
import {IObject} from '~/interfaces/common';

const useAuth = () => {
  const auth = useSelector((state: IObject<any>) => state.auth);
  return auth;
};

export const useUserIdAuth = () => {
  //todo get bein user id

  // return useSelector(
  //   (state: IObject<any>) =>
  //     state.auth?.user?.signInUserSession?.idToken?.payload?.bein_user_id,
  // );
  return 9;
};

export default useAuth;
