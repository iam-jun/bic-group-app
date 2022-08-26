import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import i18next from 'i18next';

import modalActions from '../../modal/actions';
import approveAllCommunityMemberRequests from './approveAllCommunityMemberRequests';
import groupsActions from '../actions';
import groupApi from '../../../api/GroupApi';

describe('approveAllCommunityMemberRequests saga', () => {
  const communityId = '1';
  const callback = jest.fn();
  const action = {
    type: 'test',
    payload: { communityId, callback, total: 2 },
  };

  it('should approve all member requests correctly with callback function', async () => expectSaga(approveAllCommunityMemberRequests, action)
    .put(groupsActions.resetCommunityMemberRequests())
    .provide([
      [
        matchers.call.fn(groupApi.approveAllCommunityMemberRequests),
        {},
      ],
    ])
    .put(groupsActions.getCommunityDetail({ communityId }))
    .put(
      modalActions.showHideToastMessage({
        content: `${i18next.t('groups:text_approved_all')}`,
        props: {
          textProps: { useI18n: true },
          type: 'success',
          rightIcon: 'UserGroup',
          rightText: 'Members',
          onPressRight: callback,
        },
        toastType: 'normal',
      }),
    )
    .run()
    .then(({ allEffects }: any) => {
      expect(allEffects?.length).toEqual(4);
    }));

  it('should approve all member requests correctly without callback function', async () => {
    const action = {
      type: 'test',
      payload: { communityId, total: 2 },
    };
    return expectSaga(approveAllCommunityMemberRequests, action)
      .put(groupsActions.resetCommunityMemberRequests())
      .provide([
        [
          matchers.call.fn(groupApi.approveAllCommunityMemberRequests),
          {},
        ],
      ])
      .put(groupsActions.getCommunityDetail({ communityId }))
      .put(
        modalActions.showHideToastMessage({
          content: `${i18next.t('groups:text_approved_all')}`,
          props: {
            textProps: { useI18n: true },
            type: 'success',
          },
          toastType: 'normal',
        }),
      )
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });

  it('should call API and server throws an error', async () => {
    const error = { code: 'error' };
    return expectSaga(approveAllCommunityMemberRequests, action)
      .put(groupsActions.resetCommunityMemberRequests())
      .provide([
        [
          matchers.call.fn(groupApi.approveAllCommunityMemberRequests),
          Promise.reject(error),
        ],
      ])
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(5);
      });
  });
});
