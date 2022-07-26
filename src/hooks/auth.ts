import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { put } from 'redux-saga/effects';
import authActions from '~/screens/Auth/redux/actions';
import { IObject } from '~/interfaces/common';
import modalActions from '~/store/modal/actions';
import { useBaseHook } from '~/hooks/index';

const useAuth = () => useSelector((state: IObject<any>) => state.auth);

export const useUserIdAuth = () => (
  useSelector(
    (state: IObject<any>) => state.auth?.user?.signInUserSession?.idToken?.payload?.[
      'custom:bein_user_id'
    ],
  ) || ''
);

export const useAuthToken = () => (
  useSelector(
    (state: IObject<any>) => state.auth?.user?.signInUserSession?.idToken?.jwtToken,
  ) || ''
);

export const useAuthTokenExpire = () => (
  useSelector(
    (state: IObject<any>) => state.auth?.user?.signInUserSession?.idToken?.payload?.exp,
  ) || ''
);

export const useAuthKickOut = () => {
  const dispatch = useDispatch();
  const userId = useUserIdAuth();
  const { t } = useBaseHook();

  const checkAuthKickOut = async () => {
    try {
      await Auth.currentAuthenticatedUser({
        bypassCache: true,
      });
    } catch (e) {
      if (!userId) {
        return;
      }
      dispatch(authActions.signOut());
      dispatch(
        modalActions.showAlert({
          title: t('auth:text_kickout_title'),
          content: t('auth:text_kickout_desc'),
          onConfirm: () => put(modalActions.hideAlert()),
          confirmLabel: t('auth:text_kickout_confirm_button'),
        }),
      );
    }
  };

  useEffect(() => {
    checkAuthKickOut();
  }, []);
};

export default useAuth;
