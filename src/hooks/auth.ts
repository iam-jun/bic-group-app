import { useEffect } from 'react';
import { Auth } from 'aws-amplify';
import useAuthController from '~/screens/auth/store';
import { getUserId } from '~/screens/auth/store/selectors';

export const useUserIdAuth = () => useAuthController(getUserId);

export const useAuthValidateSession = () => {
  const userId = useAuthController(getUserId);

  const checkAuthenticatedSession = async () => {
    try {
      await Auth.currentAuthenticatedUser({ bypassCache: true });
    } catch (e) {
      if (!userId) {
        return;
      }
      useAuthController.getState()?.actions?.announceSessionExpire();
    }
  };

  useEffect(
    () => {
      checkAuthenticatedSession();
    }, [],
  );
};
