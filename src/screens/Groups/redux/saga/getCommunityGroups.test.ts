import i18next from 'i18next';
import {expectSaga} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import groupsActions from '../actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import * as modalActions from '~/store/modal/actions';
import {IGroupDetail} from '~/interfaces/IGroup';
import getCommunityGroups from './getCommunityGroups';
import {GROUP_TREE} from '~/test/mock_data/group';

describe('Get Communities saga', () => {
  it('should get communities successfully with response has list with element ', () => {
    const action = {
      type: 'test',
      payload: {},
    };
    const resp = [GROUP_TREE] as any;

    return (
      // @ts-ignorets
      expectSaga(getCommunityGroups, action)
        .provide([
          [matchers.call.fn(groupsDataHelper.getCommunityGroups), resp],
        ])
        .put(groupsActions.setCommunityGroups(resp))
        .run()
        .then(({allEffects}: any) => {
          expect(allEffects?.length).toEqual(2);
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
      expectSaga(getCommunityGroups, action)
        .provide([
          [matchers.call.fn(groupsDataHelper.getCommunityGroups), resp],
        ])
        .put(groupsActions.setCommunityGroups([]))
        .run()
        .then(({allEffects}: any) => {
          expect(allEffects?.length).toEqual(2);
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
    return expectSaga(getCommunityGroups, action)
      .provide([
        [
          matchers.call.fn(groupsDataHelper.getCommunityGroups),
          Promise.reject(resp),
        ],
      ])
      .put(groupsActions.setCommunityGroups([]))
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
        expect(allEffects?.length).toEqual(3);
      });
  });
});
