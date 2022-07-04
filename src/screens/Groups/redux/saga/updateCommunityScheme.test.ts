import {expectSaga} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import updateCommunityScheme from './updateCommunityScheme';
import groupsActions from '../actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import showError from '~/store/commonSaga/showError';
import {communityScheme} from '~/test/mock_data/scheme';
import modalActions from '~/store/modal/actions';

describe('updateCommunityScheme saga', () => {
  const communityId = 1;
  const action = {
    type: 'test',
    payload: {communityId},
  };

  const state = {
    groups: {permissionScheme: {creatingScheme: {data: communityScheme}}},
  };

  const resp = {data: {}};

  it('should update scheme successfully', async () => {
    return expectSaga(updateCommunityScheme, action)
      .withState(state)
      .put(groupsActions.setCreatingScheme({creating: true}))
      .provide([
        [matchers.call.fn(groupsDataHelper.updateCommunityScheme), resp],
      ])
      .call(
        groupsDataHelper.updateCommunityScheme,
        communityId,
        communityScheme,
      )
      .put(groupsActions.setCreatingScheme({creating: false}))
      .put(groupsActions.setCommunityScheme({data: resp.data as any}))
      .put(
        modalActions.showHideToastMessage({
          content: 'communities:permission:text_update_scheme_success',
          props: {
            textProps: {useI18n: true},
            type: 'success',
          },
        }),
      )
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(6);
      });
  });

  it('should do nothing when there is no data field in response', async () => {
    return expectSaga(updateCommunityScheme, action)
      .withState(state)
      .put(groupsActions.setCreatingScheme({creating: true}))
      .provide([[matchers.call.fn(groupsDataHelper.updateCommunityScheme), {}]])
      .call(
        groupsDataHelper.updateCommunityScheme,
        communityId,
        communityScheme,
      )
      .put(groupsActions.setCreatingScheme({creating: false}))
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });

  it('should call API and server throws an error', async () => {
    const error = {code: 'error'};
    return expectSaga(updateCommunityScheme, action)
      .withState(state)
      .put(groupsActions.setCreatingScheme({creating: true}))
      .provide([
        [
          matchers.call.fn(groupsDataHelper.updateCommunityScheme),
          Promise.reject(error),
        ],
      ])
      .call(
        groupsDataHelper.updateCommunityScheme,
        communityId,
        communityScheme,
      )
      .put(groupsActions.setCreatingScheme({creating: false}))
      .call(showError, error)
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(7);
      });
  });
});
