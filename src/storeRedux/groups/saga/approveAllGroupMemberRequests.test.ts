import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import modalActions from '../../modal/actions';
import approveAllGroupMemberRequests from './approveAllGroupMemberRequests';
import groupsActions from '../actions';
import groupApi from '../../../api/GroupApi';

describe('approveAllGroupMemberRequests saga', () => {
  const groupId = '1';
  const callback = jest.fn();
  const action = {
    type: 'test',
    payload: { groupId, callback },
  };

  it('should approve all member requests correctly with callback function', async () => expectSaga(approveAllGroupMemberRequests, action)
    .put(groupsActions.resetGroupMemberRequests())
    .provide([
      [matchers.call.fn(groupApi.approveAllGroupMemberRequests), {}],
    ])
    .put(groupsActions.getGroupDetail({ groupId }))
    .put(
      modalActions.showHideToastMessage({
        content: 'Approved all joining requests',
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
      payload: { groupId },
    };

    return expectSaga(approveAllGroupMemberRequests, action)
      .put(groupsActions.resetGroupMemberRequests())
      .provide([
        [matchers.call.fn(groupApi.approveAllGroupMemberRequests), {}],
      ])
      .put(groupsActions.getGroupDetail({ groupId }))
      .put(
        modalActions.showHideToastMessage({
          content: 'Approved all joining requests',
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
    return expectSaga(approveAllGroupMemberRequests, action)
      .put(groupsActions.resetGroupMemberRequests())
      .provide([
        [
          matchers.call.fn(groupApi.approveAllGroupMemberRequests),
          Promise.reject(error),
        ],
      ])
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(5);
      });
  });
});
