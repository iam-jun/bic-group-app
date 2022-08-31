import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import groupsActions from '../actions';
import groupApi from '../../../api/GroupApi';
import * as modalActions from '../../modal/actions';
import getJoinedCommunities from './getJoinedCommunities';
import { communities } from '../../../test/mock_data/communities';

describe('Get Joined Communities saga', () => {
  it('should get communities successfully with response has list with element ', () => {
    const action = {
      type: 'test',
      payload: {},
    };
    const resp = { data: communities as any };
    return (

      expectSaga(getJoinedCommunities, action)
        .put(groupsActions.setMyCommunities({ loading: true }))
        .provide([
          [matchers.call.fn(groupApi.getJoinedCommunities), resp],
        ])
        .put(
          groupsActions.setMyCommunities({ ids: resp.data, loading: false }),
        )
        .run()
        .then(({ allEffects }: any) => {
          expect(allEffects?.length).toEqual(3);
        })
    );
  });

  it('should get communities successfully with response has empty list', () => {
    const action = {
      type: 'test',
      payload: {},
    };
    const resp = { data: [] as any };

    return (

      expectSaga(getJoinedCommunities, action)
        .put(groupsActions.setMyCommunities({ loading: true }))
        .provide([
          [matchers.call.fn(groupApi.getJoinedCommunities), resp],
        ])
        .put(groupsActions.setMyCommunities({ ids: [], loading: false }))
        .run()
        .then(({ allEffects }: any) => {
          expect(allEffects?.length).toEqual(3);
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

    return expectSaga(getJoinedCommunities, action)
      .put(groupsActions.setMyCommunities({ loading: true }))
      .provide([
        [
          matchers.call.fn(groupApi.getJoinedCommunities),
          Promise.reject(resp),
        ],
      ])
      .put(groupsActions.setMyCommunities({ loading: false }))
      .put(
        modalActions.showHideToastMessage({
          content: resp.meta.message,
          props: { isError: true },
        }),
      )
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });
});
