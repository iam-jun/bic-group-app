import {useSelector} from 'react-redux';
import {IObject} from '~/interfaces/common';

const useAuth = () => {
  return useSelector((state: IObject<any>) => state.auth);
};

export const useUserIdAuth = () => {
  return (
    useSelector(
      (state: IObject<any>) =>
        state.auth?.user?.signInUserSession?.idToken?.payload?.[
          'custom:bein_user_id'
        ],
    ) || ''
  );
};

export const useAuthToken = () => {
  return (
    useSelector(
      (state: IObject<any>) =>
        state.auth?.user?.signInUserSession?.idToken?.jwtToken,
    ) || ''
  );
};

export const useAuthTokenExpire = () => {
  return (
    useSelector(
      (state: IObject<any>) =>
        state.auth?.user?.signInUserSession?.idToken?.payload?.exp,
    ) || ''
  );
};

export default useAuth;
