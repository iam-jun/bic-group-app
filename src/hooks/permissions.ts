import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {PERMISSION_KEY} from '~/constants/permissionScheme';

import groupsActions from '~/screens/Groups/redux/actions';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import {useAuthToken, useUserIdAuth} from './auth';
import {useKeySelector} from './selector';

const EXPIRED_TIME = 1000 * 60 * 10; // 10 mins

export const useMyPermissions = () => {
  const dispatch = useDispatch();
  const token = useAuthToken();
  const userId = useUserIdAuth();
  const {loading, timeGetMyPermissions} = useKeySelector(
    groupsKeySelector.myPermissions,
  );

  const getMyPermissions = () => {
    if (token && userId && !loading) {
      dispatch(groupsActions.getMyPermissions());
    }
  };

  useEffect(() => {
    if (timeGetMyPermissions + EXPIRED_TIME <= Date.now()) {
      getMyPermissions();
    }
  }, [timeGetMyPermissions]);

  const hasPermissions = (
    requiredPermissions: string | string[],
    currentPermissions: string[],
  ) => {
    let arr = requiredPermissions;
    if (typeof requiredPermissions === 'string') {
      arr = [requiredPermissions];
    }

    return [PERMISSION_KEY.FULL_PERMISSION, ...arr].some((per: string) =>
      (currentPermissions || []).includes(per),
    );
  };

  const hasPermissionsOnCurrentAudience = (
    scope: 'communities' | 'groups',
    audienceId: number,
    requiredPermissions: string | string[],
  ) => {
    // CHECK IF CURRENT USER HAS SOME PERMISSION ON A SPECIFIC AUDIENCE

    const currentPermissions: string[] = useKeySelector(
      groupsKeySelector.permissionsByScopeAndId(scope, audienceId),
    );

    return hasPermissions(requiredPermissions, currentPermissions);
  };

  const hasPermissionsOnEveryAudience = (
    scope: 'communities' | 'groups',
    audiences: any[],
    requiredPermissions: string | string[],
  ) => {
    // CHECK IF CURRENT USER HAS SOME PERMISSION ON EVERY AUDIENCE WITH THE SAME SCOPE

    return (audiences || []).every(audience =>
      hasPermissionsOnCurrentAudience(scope, audience.id, requiredPermissions),
    );
  };

  const hasPermissionsOnSomeAudience = (
    scope: 'communities' | 'groups',
    audiences: any[],
    requiredPermissions: string | string[],
  ) => {
    // CHECK IF CURRENT USER HAS SOME PERMISSION ON AT LEAST 1 AUDIENCE WITH THE SAME SCOPE

    return (audiences || []).some(audience =>
      hasPermissionsOnCurrentAudience(scope, audience.id, requiredPermissions),
    );
  };

  return {
    hasPermissionsOnCurrentAudience,
    hasPermissionsOnEveryAudience,
    hasPermissionsOnSomeAudience,
    PERMISSION_KEY,
  };
};
