import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {PERMISSION_KEY} from '~/constants/permissionScheme';

import groupsActions from '~/screens/Groups/redux/actions';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import {useAuthToken, useUserIdAuth} from './auth';
import {useKeySelector} from './selector';

const EXPIRED_TIME = 1000 * 60 * 10; // 10 mins

export const useMyPermissions = (
  scope?: 'communities' | 'groups',
  id?: number,
) => {
  const dispatch = useDispatch();
  const token = useAuthToken();
  const userId = useUserIdAuth();
  const {loading} = useKeySelector(groupsKeySelector.myPermissions);

  const getMyPermissions = () => {
    if (token && userId && !loading) {
      dispatch(groupsActions.getMyPermissions());
    }
  };

  useEffect(() => {
    if (!scope || !id) {
      // ONLY RUN THIS WHEN START THE APP
      getMyPermissions();

      setInterval(() => {
        getMyPermissions();
      }, EXPIRED_TIME);
    }
  }, [token, userId]);

  const currentPermissions: string[] | undefined = useKeySelector(
    `groups.myPermissions.data.${scope}.${id}`,
  );

  const hasPermissions = (requiredPermissions: string[]) => {
    return [PERMISSION_KEY.FULL_PERMISSION, ...requiredPermissions].some(
      (per: string) => (currentPermissions || []).includes(per),
    );
  };

  return {hasPermissions, PERMISSION_KEY};
};
