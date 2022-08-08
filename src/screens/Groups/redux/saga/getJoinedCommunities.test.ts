import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import groupsActions from '../actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import * as modalActions from '~/store/modal/actions';
import getJoinedCommunities from './getJoinedCommunities';
import { communities } from '~/test/mock_data/communities';

describe('Get Joined Communities saga', () => {
  it('should get communities successfully with response has list with element ', () => {
    const action = {
      type: 'test',
      payload: {},
    };
    const resp = { data: communities as any };
    return (
      // @ts-ignorets
      expectSaga(getJoinedCommunities, action)
        .put(groupsActions.setMyCommunities({ loading: true }))
        .provide([
          [matchers.call.fn(groupsDataHelper.getJoinedCommunities), resp],
        ])
        .put(
          groupsActions.setMyCommunities({ data: resp.data, loading: false }),
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
      // @ts-ignorets
      expectSaga(getJoinedCommunities, action)
        .put(groupsActions.setMyCommunities({ loading: true }))
        .provide([
          [matchers.call.fn(groupsDataHelper.getJoinedCommunities), resp],
        ])
        .put(groupsActions.setMyCommunities({ data: [], loading: false }))
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

    // @ts-ignore
    return expectSaga(getJoinedCommunities, action)
      .put(groupsActions.setMyCommunities({ loading: true }))
      .provide([
        [
          matchers.call.fn(groupsDataHelper.getJoinedCommunities),
          Promise.reject(resp),
        ],
      ])
      .put(groupsActions.setMyCommunities({ loading: false }))
      .put(
        modalActions.showHideToastMessage({
          content: resp.meta.message,
          props: {
            textProps: { useI18n: true },
            type: 'error',
          },
        }),
      )
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });
});
