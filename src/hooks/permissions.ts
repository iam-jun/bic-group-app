import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { PERMISSION_KEY } from '~/constants/permissionScheme';

import groupsActions from '~/storeRedux/groups/actions';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
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

  /**
   * we use scope `groups`
   * scope `community` is used for admin panel on web only
   */
  const permissionData = data?.groups;

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
    id: string,
    requiredPermissions: string | string[],
  ) => {
    // CHECK IF CURRENT USER HAS SOME PERMISSION

    const currentPermissions: string[] = permissionData?.[id] || [];
    return hasPermissions(
      requiredPermissions, currentPermissions,
    );
  };

  // CHECK IF CURRENT USER HAS SOME PERMISSION ON AT LEAST 1 SCOPE
  const hasPermissionsOnAtLeastOneScope = (
    audiences: any[],
    requiredPermissions: string | string[],
  ) => (audiences || []).some((audience) => hasPermissionsOnScopeWithId(
    audience.id, requiredPermissions,
  ));

  const getListOfChosenAudiencesWithoutPermission = (
    audiences: any[],
    requiredPermissions: string | string[],
  // eslint-disable-next-line array-callback-return
  ) => (audiences || []).filter((audience) => {
    if (
      !hasPermissionsOnScopeWithId(audience.id, requiredPermissions)
    ) {
      return audience;
    }
  });

  return {
    hasPermissionsOnScopeWithId,
    hasPermissionsOnAtLeastOneScope,
    PERMISSION_KEY,
    getListOfChosenAudiencesWithoutPermission,
  };
};
