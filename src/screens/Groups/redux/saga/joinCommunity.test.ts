import {expectSaga} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import i18next from 'i18next';

import groupsDataHelper from '../../helper/GroupsDataHelper';
import showError from '~/store/commonSaga/showError';
import joinCommunity from './joinCommunity';
import groupsActions from '../actions';
import modalActions from '~/store/modal/actions';

describe('joinCommuniity saga', () => {
  const communityId = 1;
  const communityName = 'Community Name Test';
  const action = {
    type: 'test',
    payload: {communityId, communityName},
  };

  it('should send join request to Private community correctly', () => {
    const response = {data: {join_status: 3}};

    return expectSaga(joinCommunity, action)
      .provide([[matchers.call.fn(groupsDataHelper.joinCommunity), response]])
      .put(
        groupsActions.editDiscoverCommunityItem({
          id: communityId,
          data: {join_status: 3},
        }),
      )
      .put(groupsActions.getCommunityDetail({communityId}))
      .put(
        modalActions.showHideToastMessage({
          content: `${i18next.t(
            'groups:text_request_join_community',
          )} ${communityName}`,
          props: {
            type: 'success',
          },
        }),
      )
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });

  it('should join PUBLIC/OPEN community correctly', () => {
    const response = {data: {join_status: 2}};

    return expectSaga(joinCommunity, action)
      .provide([[matchers.call.fn(groupsDataHelper.joinCommunity), response]])
      .put(
        groupsActions.editDiscoverCommunityItem({
          id: communityId,
          data: {join_status: 2},
        }),
      )
      .put(
        modalActions.showHideToastMessage({
          content: `${i18next.t(
            'groups:text_successfully_join_community',
          )} ${communityName}`,
          props: {
            type: 'success',
          },
        }),
      )
      .put(groupsActions.getCommunityDetail({communityId}))
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });

  it('should send join request and server throws error', () => {
    const error = {code: 'error'};
    return expectSaga(joinCommunity, action)
      .provide([
        [
          matchers.call.fn(groupsDataHelper.joinCommunity),
          Promise.reject(error),
        ],
      ])
      .call(showError, error)
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });
});
