import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import groupsActions from '~/screens/Groups/redux/actions';
import getYourGroupsSearch from '~/screens/Groups/redux/saga/getYourGroupsSearch';
import { communityDetailData } from '~/test/mock_data/communities';
import { IGetYourGroupsSearch } from '~/interfaces/IGroup';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';
import { throwError } from 'redux-saga-test-plan/providers';

describe('GetYourGroupsSearch saga', () => {
  it('should set result without call backend if key is empty', () => {
    const payload: IGetYourGroupsSearch = {
      communityId: communityDetailData.id,
      key: '',
    };
    return expectSaga(getYourGroupsSearch, { type: 'test', payload })
      .put(
        groupsActions.setYourGroupsSearch({ loading: false, list: [], key: '' }),
      )
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(1);
      });
  });

  it('should set data call backend success', () => {
    const payload: IGetYourGroupsSearch = {
      communityId: communityDetailData.id,
      key: 'bein',
    };
    const res = { data: [{ groupdId: 1 }] };
    const storeData = { groups: { yourGroupsSearch: { key: 'bein' } } };
    return expectSaga(getYourGroupsSearch, { type: 'test', payload })
      .withState(storeData)
      .provide([[matchers.call.fn(groupsDataHelper.getCommunityGroups), res]])
      .put(groupsActions.setYourGroupsSearch({ loading: true, key: 'bein' }))
      .put(groupsActions.setYourGroupsSearch({ loading: false, list: res.data }))
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });

  it('should set data empty when call backend success with current search key empty', () => {
    const payload: IGetYourGroupsSearch = {
      communityId: communityDetailData.id,
      key: 'bein',
    };
    const list = [{ groupdId: 1 }];
    const storeData = { groups: { yourGroupsSearch: { key: '' } } };
    return expectSaga(getYourGroupsSearch, { type: 'test', payload })
      .withState(storeData)
      .provide([[matchers.call.fn(groupsDataHelper.getCommunityGroups), list]])
      .put(groupsActions.setYourGroupsSearch({ loading: true, key: 'bein' }))
      .put(groupsActions.setYourGroupsSearch({ loading: false, list: [] }))
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });

  it('should set loading false when call backend failed', () => {
    const payload: IGetYourGroupsSearch = {
      communityId: communityDetailData.id,
      key: 'bein',
    };
    const storeData = { groups: { yourGroupsSearch: { key: '' } } };
    return expectSaga(getYourGroupsSearch, { type: 'test', payload })
      .withState(storeData)
      .provide([
        matchers.call.fn(groupsDataHelper.getCommunityGroups),
        throwError(new Error('empty data')),
      ])
      .put(groupsActions.setYourGroupsSearch({ loading: true, key: 'bein' }))
      .put(groupsActions.setYourGroupsSearch({ loading: false }))
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(3);
      });
  });
});
