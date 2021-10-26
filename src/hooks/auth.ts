import {useSelector} from 'react-redux';
import {IObject} from '~/interfaces/common';

const useAuth = () => {
  const auth = useSelector((state: IObject<any>) => state.auth);
  return auth;
};

export const useUserIdAuth = () => {
  const userId =
    useSelector(
      (state: IObject<any>) =>
        state.auth?.user?.signInUserSession?.idToken?.payload?.[
          'custom:bein_user_id'
          ],
    ) || '';
  return userId;
};

export default useAuth;
