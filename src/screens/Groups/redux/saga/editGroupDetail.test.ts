import i18next from 'i18next';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import editGroupDetail from './editGroupDetail';
import groupsActions from '../actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import * as modalActions from '~/store/modal/actions';
import { IGroupDetail } from '~/interfaces/IGroup';

describe('Edit group detail saga', () => {
  const callback = jest.fn();

  it('should edit group detail with full payload successfully', () => {
    const action = {
      type: 'test',
      payload: { data: { id: '3' }, editFieldName: 'Description', callback },
    };
    const resp = {
      data: { group: { id: '10' } } as IGroupDetail,
    };

    return expectSaga(editGroupDetail, action)
      .provide([[matchers.call.fn(groupsDataHelper.editGroupDetail), resp]])
      .put(
        modalActions.showHideToastMessage({
          content: `${action.payload.editFieldName} ${i18next.t(
            'common:text_updated_successfully',
          )}`,
          props: {
            textProps: { useI18n: true },
            type: 'success',
          },
        }),
      )
      .put(groupsActions.setGroupDetail(resp?.data))
      .run();
  });

  it('should edit group detail without editFieldName successfully', () => {
    const action = {
      type: 'test',
      payload: { data: { id: '1' }, callback },
    };
    const resp = {
      data: {} as IGroupDetail,
    };

    return expectSaga(editGroupDetail, action)
      .provide([[matchers.call.fn(groupsDataHelper.editGroupDetail), resp]])
      .put(groupsActions.setGroupDetail(resp?.data))
      .run();
  });

  it('should edit group detail without callback fn successfully', () => {
    const action = {
      type: 'test',
      payload: { data: { id: '3' }, editFieldName: 'Description' },
    };
    const resp = {
      data: { group: { id: '10' } } as IGroupDetail,
    };

    return expectSaga(editGroupDetail, action)
      .provide([[matchers.call.fn(groupsDataHelper.editGroupDetail), resp]])
      .put(
        modalActions.showHideToastMessage({
          content: `${action.payload.editFieldName} ${i18next.t(
            'common:text_updated_successfully',
          )}`,
          props: {
            textProps: { useI18n: true },
            type: 'success',
          },
        }),
      )
      .put(groupsActions.setGroupDetail(resp?.data))
      .run();
  });

  it('should call server and server throws an error', () => {
    const action = {
      type: 'test',
      payload: { data: { id: '1' } },
    };

    return expectSaga(editGroupDetail, action)
      .provide([
        [
          matchers.call.fn(groupsDataHelper.editGroupDetail),
          Promise.reject({ code: 1 }),
        ],
      ])
      .put(
        modalActions.showHideToastMessage({
          content: 'common:text_error_message',
          props: {
            textProps: { useI18n: true },
            type: 'error',
          },
        }),
      )
      .put(groupsActions.setLoadingAvatar(false))
      .put(groupsActions.setLoadingCover(false))
      .run();
  });
});
