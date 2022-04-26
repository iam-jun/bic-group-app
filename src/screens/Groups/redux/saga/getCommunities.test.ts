import {expectSaga} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import groupsActions from '../actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import * as modalActions from '~/store/modal/actions';
import getCommunities from './getCommunities';
import {communities} from '~/test/mock_data/communities';

describe('Get Communities saga', () => {
  const storeData = {
    groups: {
      communities: {
        data: [],
      },
    },
  };

  it('should get communities successfully with response has list with element ', () => {
    const action = {
      type: 'test',
      payload: {},
    };
    const resp = communities as any;
    return (
      // @ts-ignorets
      expectSaga(getCommunities, action)
        .withState(storeData)
        .put(groupsActions.setMyCommunities({data: [], loading: true}))
        .provide([[matchers.call.fn(groupsDataHelper.getCommunities), resp]])
        .put(
          groupsActions.setMyCommunities({data: communities, loading: false}),
        )
        .run()
        .then(({allEffects}: any) => {
          expect(allEffects?.length).toEqual(4);
        })
    );
  });

  it('should get communities successfully with response has empty list', () => {
    const action = {
      type: 'test',
      payload: {},
    };
    const resp = [] as any;

    return (
      // @ts-ignorets
      expectSaga(getCommunities, action)
        .withState(storeData)
        .put(groupsActions.setMyCommunities({data: [], loading: true}))
        .provide([[matchers.call.fn(groupsDataHelper.getCommunities), resp]])
        .put(groupsActions.setMyCommunities({data: [], loading: false}))
        .run()
        .then(({allEffects}: any) => {
          expect(allEffects?.length).toEqual(4);
        })
    );
  });

  it('should call server and server throws an error', () => {
    const action = {
      type: 'test',
      payload: {},
    };
    const resp = {
      code: 'server_internal_error',
      data: null,
      meta: {
        message: 'Not a valid JWT token',
      },
    };

    //@ts-ignore
    return expectSaga(getCommunities, action)
      .withState(storeData)
      .put(groupsActions.setMyCommunities({data: [], loading: true}))
      .provide([
        [
          matchers.call.fn(groupsDataHelper.getCommunities),
          Promise.reject(resp),
        ],
      ])
      .put(groupsActions.setMyCommunities({data: [], loading: false}))
      .put(
        modalActions.showHideToastMessage({
          content: resp.meta.message,
          props: {
            textProps: {useI18n: true},
            type: 'error',
          },
        }),
      )
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(5);
      });
  });
});
