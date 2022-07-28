import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { PERMISSION_KEY } from '~/constants/permissionScheme';

import groupsActions from '~/screens/Groups/redux/actions';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import { useAuthToken, useUserIdAuth } from './auth';
import { useKeySelector } from './selector';

const EXPIRED_TIME = 1000 * 60 * 10; // 10 mins

export const useMyPermissions = () => {
  const dispatch = useDispatch();
  const token = useAuthToken();
  const userId = useUserIdAuth();
  const {
    loading,
    timeGetMyPermissions,
    data = {},
  } = useKeySelector(groupsKeySelector.myPermissions);

  const getMyPermissions = () => {
    if (token && userId && !loading) {
      dispatch(groupsActions.getMyPermissions());
    }
  };

  useEffect(
    () => {
      if (timeGetMyPermissions + EXPIRED_TIME <= Date.now()) {
        getMyPermissions();
      }
    }, [timeGetMyPermissions],
  );

  const hasPermissions = (
    requiredPermissions: string | string[],
    currentPermissions: string[],
  ) => {
    let arr = requiredPermissions;
    if (typeof requiredPermissions === 'string') {
      arr = [requiredPermissions];
    }

    return [PERMISSION_KEY.FULL_PERMISSION, ...arr].some((per: string) => (currentPermissions || []).includes(per));
  };

  const hasPermissionsOnScopeWithId = (
    scope: 'communities' | 'groups',
    id: string,
    requiredPermissions: string | string[],
  ) => {
    // CHECK IF CURRENT USER HAS SOME PERMISSION ON A SPECIFIC SCOPE

    const currentPermissions: string[] = data?.[scope]?.[id] || [];
    return hasPermissions(
      requiredPermissions, currentPermissions,
    );
  };

  // CHECK IF CURRENT USER HAS SOME PERMISSION ON EVERY SCOPE
  const hasPermissionsOnEachScope = (
    scope: 'communities' | 'groups',
    audiences: any[],
    requiredPermissions: string | string[],
  ) => (audiences || []).every((audience) => hasPermissionsOnScopeWithId(
    scope, audience.id, requiredPermissions,
  ));

  // CHECK IF CURRENT USER HAS SOME PERMISSION ON AT LEAST 1 SCOPE
  const hasPermissionsOnAtLeastOneScope = (
    scope: 'communities' | 'groups',
    audiences: any[],
    requiredPermissions: string | string[],
  ) => (audiences || []).some((audience) => hasPermissionsOnScopeWithId(
    scope, audience.id, requiredPermissions,
  ));
  return {
    hasPermissionsOnScopeWithId,
    hasPermissionsOnEachScope,
    hasPermissionsOnAtLeastOneScope,
    PERMISSION_KEY,
  };
};
