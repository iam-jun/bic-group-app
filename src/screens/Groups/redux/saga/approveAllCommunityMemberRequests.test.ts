import {expectSaga} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import i18next from 'i18next';

import modalActions from '~/store/modal/actions';
import approveAllCommunityMemberRequests from './approveAllCommunityMemberRequests';
import groupsActions from '../actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';

describe('approveAllCommunityMemberRequests saga', () => {
  const communityId = 1;
  const total = 3;
  const callback = jest.fn();
  const action = {
    type: 'test',
    payload: {communityId, total, callback},
  };

  it('should approve all member requests correctly with callback function', async () => {
    return expectSaga(approveAllCommunityMemberRequests, action)
      .put(groupsActions.resetCommunityMemberRequests())
      .provide([
        [
          matchers.call.fn(groupsDataHelper.approveAllCommunityMemberRequests),
          {},
        ],
      ])
      .put(groupsActions.getCommunityDetail({communityId}))
      .put(
        modalActions.showHideToastMessage({
          content: `${i18next.t('groups:text_approved_all')}`,
          props: {
            textProps: {useI18n: true},
            type: 'success',
            rightIcon: 'UsersAlt',
            rightText: 'Members',
            onPressRight: callback,
          },
          toastType: 'normal',
        }),
      )
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });

  it('should approve all member requests correctly without callback function', async () => {
    const action = {
      type: 'test',
      payload: {communityId, total},
    };
    return expectSaga(approveAllCommunityMemberRequests, action)
      .put(groupsActions.resetCommunityMemberRequests())
      .provide([
        [
          matchers.call.fn(groupsDataHelper.approveAllCommunityMemberRequests),
          {},
        ],
      ])
      .put(groupsActions.getCommunityDetail({communityId}))
      .put(
        modalActions.showHideToastMessage({
          content: `${i18next.t('groups:text_approved_all')}`,
          props: {
            textProps: {useI18n: true},
            type: 'success',
          },
          toastType: 'normal',
        }),
      )
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });

  it('should call API and server throws an error', async () => {
    const error = {code: 'error'};
    return expectSaga(approveAllCommunityMemberRequests, action)
      .put(groupsActions.resetCommunityMemberRequests())
      .provide([
        [
          matchers.call.fn(groupsDataHelper.approveAllCommunityMemberRequests),
          Promise.reject(error),
        ],
      ])
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(5);
      });
  });
});
