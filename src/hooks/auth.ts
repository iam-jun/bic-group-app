import {useSelector} from 'react-redux';
import {IObject} from '~/interfaces/common';

const useAuth = () => {
  const auth = useSelector((state: IObject<any>) => state.auth);
  return auth;
};

export const useUserIdAuth = () => {
  return useSelector(
    (state: IObject<any>) =>
      state.auth?.user?.signInUserSession?.idToken?.payload?.bein_user_id,
  );
};

export default useAuth;
