import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import getGroupScheme from './getGroupScheme';
import groupsActions from '../actions';
import groupsDataHelper from '../../../screens/Groups/helper/GroupsDataHelper';
import showError from '../../commonSaga/showError';
import { groupScheme } from '../../../test/mock_data/scheme';
import API_ERROR_CODE from '../../../constants/apiErrorCode';
import { sortFixedRoles } from '../../../screens/Groups/helper';

describe('getGroupScheme saga', () => {
  const communityId = 1;
  const schemeId = 'abc';
  const action = {
    type: 'test',
    payload: { communityId, schemeId },
  };

  const resp = { data: groupScheme };
  const dataWithOrderedFixRole = sortFixedRoles(resp.data);

  it('should get data successfully', async () => expectSaga(getGroupScheme, action)
    .provide([[matchers.call.fn(groupsDataHelper.getGroupScheme), resp]])
    .call(groupsDataHelper.getGroupScheme, communityId, schemeId)
    .put(groupsActions.setGroupScheme({ data: dataWithOrderedFixRole }))
    .put(groupsActions.setCreatingScheme({ data: dataWithOrderedFixRole, memberRoleIndex: 1 }))
    .run()
    .then(({ allEffects }: any) => {
      expect(allEffects?.length).toEqual(3);
    }));

  it('should throw error group scheme not found', async () => {
    const error = { code: API_ERROR_CODE.GROUP.SCHEME_NOT_FOUND };
    return expectSaga(getGroupScheme, action)
      .provide([
        [
          matchers.call.fn(groupsDataHelper.getGroupScheme),
          Promise.reject(error),
        ],
      ])
      .call(groupsDataHelper.getGroupScheme, communityId, schemeId)
      .put(groupsActions.getSchemes({ communityId, isRefreshing: true }))
      .call(showError, error)
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(5);
      });
  });

  it('should call API and server throws error', async () => {
    const error = { code: 'error' };
    return expectSaga(getGroupScheme, action)
      .provide([
        [
          matchers.call.fn(groupsDataHelper.getGroupScheme),
          Promise.reject(error),
        ],
      ])
      .call(groupsDataHelper.getGroupScheme, communityId, schemeId)
      .call(showError, error)
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });
});
