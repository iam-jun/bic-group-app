import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import { throwError } from 'redux-saga-test-plan/providers';
import groupsActions from '~/screens/Groups/redux/actions';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';
import getYourGroupsTree from '~/screens/Groups/redux/saga/GetYourGroupsTree';

describe('GetYourGroupsTree saga', () => {
  it('should set data call backend success', () => {
    const res = { data: [{ groupdId: 1 }] };
    return expectSaga(getYourGroupsTree, { type: 'test', payload: '1' })
      .provide([[matchers.call.fn(groupsDataHelper.getCommunityGroups), res]])
      .put(groupsActions.setYourGroupsTree({ loading: true }))
      .put(groupsActions.setYourGroupsTree({ loading: false, list: res.data }))
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(3);
      });
  });

  it('should set loading false when call backend failed', () => expectSaga(getYourGroupsTree, { type: 'test', payload: 1 })
    .provide([
      matchers.call.fn(groupsDataHelper.getCommunityGroups),
      throwError(new Error('empty data')),
    ])
    .put(groupsActions.setYourGroupsTree({ loading: true }))
    .put(groupsActions.setYourGroupsTree({ loading: false }))
    .run()
    .then(({ allEffects }: any) => {
      expect(allEffects?.length).toEqual(4);
    }));
});
