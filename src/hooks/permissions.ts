import {useEffect} from 'react';
import {useDispatch} from 'react-redux';

import groupsActions from '~/screens/Groups/redux/actions';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import {useAuthToken, useUserIdAuth} from './auth';
import {useKeySelector} from './selector';

const EXPIRED_TIME = 1000 * 60 * 10;

export const useGetMyPermissions = () => {
  const dispatch = useDispatch();
  const token = useAuthToken();
  const userId = useUserIdAuth();
  const {loading} = useKeySelector(groupsKeySelector.myPermissions);

  useEffect(() => {
    const getMyPermissions = () => {
      if (token && userId && !loading) {
        dispatch(groupsActions.getMyPermissions());
      }
    };
    getMyPermissions();

    setInterval(() => {
      getMyPermissions();
    }, EXPIRED_TIME);
  }, [token, userId]);
};
