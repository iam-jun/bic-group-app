import i18next from 'i18next';
import groupApi from '~/api/GroupApi';
import modalActions from '~/storeRedux/modal/actions';
import { act, renderHook } from '~/test/testUtils';
import useGroupDetailStore from '../../GroupDetail/store';
import useGroupController from '../index';

describe('editGroupDetail', () => {
  const editGroupPayload = {
    id: '65ef1299-f7f2-439d-82f6-a242168ef974',
    rootGroupId: '65ef1299-f7f2-439d-82f6-a242168ef979',
  };

  it('should edit group detail success:', () => {
    const response = {
      code: 200,
      data: {},
      meta: {},
    };
    const spy = jest.spyOn(groupApi, 'editGroupDetail').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const setGroupDetail = jest.fn();
    const actions = {
      setGroupDetail,
    };
    jest.spyOn(useGroupDetailStore, 'getState').mockImplementation(
      () => ({ actions } as any),
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupController((state) => state));
    act(() => {
      result.current.actions.editGroupDetail(editGroupPayload);
    });

    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(setGroupDetail).toBeCalled();
  });

  it('should edit group detail success with editFieldName:', () => {
    const response = {
      code: 200,
      data: {},
      meta: {},
    };
    const editFieldName = 'Descritpion';
    const spy = jest.spyOn(groupApi, 'editGroupDetail').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const setGroupDetail = jest.fn();
    const actions = {
      setGroupDetail,
    };
    jest.spyOn(useGroupDetailStore, 'getState').mockImplementation(
      () => ({ actions } as any),
    );

    const spyModalActions = jest.spyOn(modalActions, 'showHideToastMessage');

    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupController((state) => state));
    act(() => {
      result.current.actions.editGroupDetail(editGroupPayload, editFieldName);
    });

    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    const toastContent = `${editFieldName} ${i18next.t('common:text_updated_successfully')}`;

    expect(spyModalActions).toBeCalledWith({ content: toastContent });
    expect(setGroupDetail).toBeCalled();
  });

  it('should edit group detail success and props callback is called:', () => {
    const callback = jest.fn();
    const response = {
      code: 200,
      data: {},
      meta: {},
    };
    const spy = jest.spyOn(groupApi, 'editGroupDetail').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const setGroupDetail = jest.fn();
    const actions = {
      setGroupDetail,
    };
    jest.spyOn(useGroupDetailStore, 'getState').mockImplementation(
      () => ({ actions } as any),
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupController((state) => state));
    act(() => {
      result.current.actions.editGroupDetail(editGroupPayload, '', callback);
    });

    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(setGroupDetail).toBeCalled();
    expect(callback).toBeCalled();
  });

  it('should set group admin throw error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(groupApi, 'editGroupDetail').mockImplementation(
      () => Promise.reject(error) as any,
    );
    const spyModalActions = jest.spyOn(modalActions, 'showHideToastMessage');

    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupController((state) => state));

    act(() => {
      try {
        result.current.actions.editGroupDetail(editGroupPayload);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyModalActions).toBeCalledWith({
      content: 'common:text_error_message',
      props: { type: 'error' },
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });
});
