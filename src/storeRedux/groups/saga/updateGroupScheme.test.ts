import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import updateGroupScheme from './updateGroupScheme';
import groupsActions from '../actions';
import groupsDataHelper from '../../../screens/Groups/helper/GroupsDataHelper';
import showError from '../../commonSaga/showError';
import { groupScheme } from '../../../test/mock_data/scheme';
import modalActions from '../../modal/actions';

describe('updateGroupScheme saga', () => {
  const communityId = 1;
  const schemeId = 'abc';
  const action = {
    type: 'test',
    payload: { communityId, schemeId },
  };

  const state = {
    groups: { permissionScheme: { creatingScheme: { data: groupScheme } } },
  };

  const resp = { data: {} };

  it('should update scheme successfully', async () => expectSaga(updateGroupScheme, action)
    .withState(state)
    .put(groupsActions.setCreatingScheme({ creating: true }))
    .provide([[matchers.call.fn(groupsDataHelper.updateGroupScheme), resp]])
    .call(
      groupsDataHelper.updateGroupScheme,
      communityId,
      schemeId,
      groupScheme,
    )
    .put(groupsActions.setCreatingScheme({ creating: false }))
    .put(groupsActions.getSchemes({ communityId, isRefreshing: true }))
    .put(
      modalActions.showHideToastMessage({
        content: 'communities:permission:text_update_scheme_success',
        props: {
          textProps: { useI18n: true },
          type: 'success',
        },
      }),
    )
    .run()
    .then(({ allEffects }: any) => {
      expect(allEffects?.length).toEqual(6);
    }));

  it('should do nothing when there is no data field in response', async () => expectSaga(updateGroupScheme, action)
    .withState(state)
    .put(groupsActions.setCreatingScheme({ creating: true }))
    .provide([[matchers.call.fn(groupsDataHelper.updateGroupScheme), {}]])
    .call(
      groupsDataHelper.updateGroupScheme,
      communityId,
      schemeId,
      groupScheme,
    )
    .put(groupsActions.setCreatingScheme({ creating: false }))
    .run()
    .then(({ allEffects }: any) => {
      expect(allEffects?.length).toEqual(4);
    }));

  it('should call API and server throws an error', async () => {
    const error = { code: 'error' };
    return expectSaga(updateGroupScheme, action)
      .withState(state)
      .put(groupsActions.setCreatingScheme({ creating: true }))
      .provide([
        [
          matchers.call.fn(groupsDataHelper.updateGroupScheme),
          Promise.reject(error),
        ],
      ])
      .call(
        groupsDataHelper.updateGroupScheme,
        communityId,
        schemeId,
        groupScheme,
      )
      .put(groupsActions.setCreatingScheme({ creating: false }))
      .call(showError, error)
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(7);
      });
  });
});
