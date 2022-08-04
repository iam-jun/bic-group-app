import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import groupsActions from '~/screens/Groups/redux/actions';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';
import { throwError } from 'redux-saga-test-plan/providers';
import getYourGroupsList from '~/screens/Groups/redux/saga/getYourGroupsList';

describe('GetYourGroupsList saga', () => {
  it('should set data call backend success', () => {
    const resp = { data: [{ groupdId: 1 }] };
    return expectSaga(getYourGroupsList, { type: 'test', payload: 1 })
      .provide([[matchers.call.fn(groupsDataHelper.getCommunityGroups), resp]])
      .put(groupsActions.setYourGroupsList({ loading: true }))
      .put(groupsActions.setYourGroupsList({ loading: false, list: resp.data }))
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(3);
      });
  });

  it('should set loading false when call backend failed', () => {
    return expectSaga(getYourGroupsList, { type: 'test', payload: 1 })
      .provide([
        matchers.call.fn(groupsDataHelper.getCommunityGroups),
        throwError(new Error('empty data')),
      ])
      .put(groupsActions.setYourGroupsList({ loading: true }))
      .put(groupsActions.setYourGroupsList({ loading: false }))
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });
});
