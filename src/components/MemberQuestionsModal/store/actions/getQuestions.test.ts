import { act, renderHook } from '~/test/testUtils';
import groupApi from '~/api/GroupApi';
import useMemberQuestionsStore from '../index';
import { MEMBERSHIP_QUESITONS } from '~/test/mock_data/group';
import useModalStore from '~/store/modal';

describe('get membership questions actions', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  it('should get questions successfully', () => {
    const response = { data: MEMBERSHIP_QUESITONS };
    const callBackError = jest.fn();
    const groupId = 'testGroupId';
    const spyCallApi = jest
      .spyOn(groupApi, 'getMembershipQuestions')
      .mockImplementation(() => Promise.resolve(response) as any);
    jest.useFakeTimers();
    const { result } = renderHook(() => useMemberQuestionsStore((state) => state));
    expect(result.current.loading).toBeTruthy();
    act(() => {
      result.current.actions.getQuestions(groupId, callBackError);
    });
    expect(result.current.loading).toBeTruthy();
    act(() => {
      jest.runAllTimers();
    });
    expect(spyCallApi).toBeCalled();
    expect(result.current.loading).toBeFalsy();
    expect(result.current.ids.length).toEqual(response.data.length);
  });

  it('should get questions throw error:', () => {
    const error = 'error';
    const groupId = 'testGroupId';
    const callBackError = jest.fn();
    const spyCallApi = jest
      .spyOn(groupApi, 'getMembershipQuestions')
      .mockImplementation(() => Promise.reject(error) as any);

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useMemberQuestionsStore((state) => state));
    expect(result.current.loading).toBeTruthy();
    act(() => {
      try {
        result.current.actions.getQuestions(groupId, callBackError);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });
    expect(result.current.loading).toBeTruthy();
    act(() => {
      jest.runAllTimers();
    });
    expect(spyCallApi).toBeCalled();
    expect(result.current.loading).toBeFalsy();
    expect(result.current.ids.length).toEqual(0);
    expect(showToast).toBeCalled();
  });

  it('should get questions but response data = []', () => {
    const response = { data: [] };
    const callBackError = jest.fn();
    const groupId = 'testGroupId';
    const spyCallApi = jest
      .spyOn(groupApi, 'getMembershipQuestions')
      .mockImplementation(() => Promise.resolve(response) as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => useMemberQuestionsStore((state) => state));
    expect(result.current.loading).toBeTruthy();
    act(() => {
      result.current.actions.getQuestions(groupId, callBackError);
    });
    expect(result.current.loading).toBeTruthy();
    act(() => {
      jest.runAllTimers();
    });
    expect(spyCallApi).toBeCalled();
    expect(result.current.loading).toBeFalsy();
    expect(result.current.ids.length).toEqual(0);
    expect(callBackError).toBeCalled();
  });

  it('setMembershipQuestionsInfo should change store state:', () => {
    const payload = {
      groupId: 'id',
      rootGroupId: 'groupId',
      name: 'name',
      type: 'community',
      isActive: true,
      isActiveGroupTerms: true,
    };
    const { result } = renderHook(() => useMemberQuestionsStore((state) => state));
    act(() => {
      result.current.actions.setMembershipQuestionsInfo(payload);
    });
    expect(result.current.groupId).toEqual(payload.groupId);
    expect(result.current.rootGroupId).toEqual(payload.rootGroupId);
    expect(result.current.name).toEqual(payload.name);
    expect(result.current.type).toEqual(payload.type);
    expect(result.current.isActiveGroupTerms).toBeTruthy();
    expect(result.current.isActive).toBeTruthy();
  });

  it('setAnswer should change store state:', () => {
    const text = 'answer';
    const answer = {
      [MEMBERSHIP_QUESITONS[0].id]: {
        questionId: MEMBERSHIP_QUESITONS[0].id,
        answer: text,
      },
    };

    const { result } = renderHook(() => useMemberQuestionsStore((state) => state));
    act(() => {
      result.current.actions.setAnswer(MEMBERSHIP_QUESITONS[0].id, text);
    });
    expect(result.current.answers).toEqual(answer);
  });
});
