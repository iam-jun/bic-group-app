import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import groupsActions from '../actions';
import groupApi from '../../../api/GroupApi';
import * as modalActions from '../../modal/actions';
import getCommunityGroups from './getCommunityGroups';
import { GROUP_TREE } from '../../../test/mock_data/group';

describe('Get Communities saga', () => {
  it('should get communities successfully with response has list with element ', () => {
    const action = {
      type: 'test',
      payload: {
        id: '1',
      },
    };
    const resp = { data: [GROUP_TREE] as any };

    return (
      expectSaga(getCommunityGroups, action)
        .provide([
          [matchers.call.fn(groupApi.getCommunityGroups), resp],
        ])
        .put(groupsActions.setCommunityGroups(resp.data))
        .run()
        .then(({ allEffects }: any) => {
          expect(allEffects?.length).toEqual(2);
        })
    );
  });

  it('should get communities successfully with response has empty list', () => {
    const action = {
      type: 'test',
      payload: { id: '1' },
    };
    const resp = { data: [] as any };

    return (
      expectSaga(getCommunityGroups, action)
        .provide([
          [matchers.call.fn(groupApi.getCommunityGroups), resp],
        ])
        .put(groupsActions.setCommunityGroups([]))
        .run()
        .then(({ allEffects }: any) => {
          expect(allEffects?.length).toEqual(2);
        })
    );
  });

  it('should call server and server throws an error', () => {
    const action = {
      type: 'test',
      payload: { id: '1' },
    };
    const resp = {
      code: 'server_internal_error',
      data: null,
      meta: {
        message: 'Not a valid JWT token',
      },
    };

    return expectSaga(getCommunityGroups, action)
      .provide([
        [
          matchers.call.fn(groupApi.getCommunityGroups),
          Promise.reject(resp),
        ],
      ])
      .put(groupsActions.setCommunityGroups([]))
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
        expect(allEffects?.length).toEqual(3);
      });
  });
});
