import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {PERMISSION_KEY} from '~/constants/permissionScheme';

import groupsActions from '~/screens/Groups/redux/actions';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import {useAuthToken, useUserIdAuth} from './auth';
import {useKeySelector} from './selector';

const EXPIRED_TIME = 1000 * 60 * 10; // 10 mins

export const useMyPermissions = (
  scope: 'communities' | 'groups',
  id: number,
) => {
  const dispatch = useDispatch();
  const token = useAuthToken();
  const userId = useUserIdAuth();
  const {loading, timeGetMyPermissions} = useKeySelector(
    groupsKeySelector.myPermissions,
  );
  const currentPermissions: string[] = useKeySelector(
    groupsKeySelector.permissionsByScopeAndId(scope, id),
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

  const hasPermissions = (requiredPermissions: string | string[]) => {
    let arr = requiredPermissions;
    if (typeof requiredPermissions === 'string') {
      arr = [requiredPermissions];
    }

    return [PERMISSION_KEY.FULL_PERMISSION, ...arr].some((per: string) =>
      (currentPermissions || []).includes(per),
    );
  };

  return {hasPermissions, PERMISSION_KEY};
};
