import { act, renderHook } from '~/test/testUtils';
import useEditCommentController from '../index';
import { IPayloadPutEditComment } from '~/interfaces/IPost';
import streamApi from '~/api/StreamApi';
import { mockComment, mockResponseEditComment } from '~/test/mock_data/comment';
import useCommentInputStore from '~/screens/comments/components/CommentInputView/store';
import useModalStore from '~/store/modal';
import { ToastType } from '~/baseComponents/Toast/BaseToast';

describe('editComment actions', () => {
  const mockId = 'b2e43944-a8fb-4743-bd5d-c820864e1add';

  const mockDataEdit = {
    content: 'Doooo @bigguyyy hiiiiiiiii :bic_hugging_face: ',
    giphy: undefined,
    media: { images: [] },
  };

  it('should edit comment successfully:', () => {
    const response = mockResponseEditComment;
    const payload: IPayloadPutEditComment = {
      id: mockId,
      comment: mockComment,
      data: mockDataEdit,
    };
    const spyCallApi = jest
      .spyOn(streamApi, 'putEditComment')
      .mockImplementation(() => Promise.resolve(response) as any);

    const setCreateComment = jest.fn();
    jest.spyOn(useCommentInputStore, 'getState').mockImplementation(() => ({ actions: { setCreateComment } } as any));

    const showToast = jest.fn();
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions: { showToast } } as any));

    jest.useFakeTimers();

    const { result } = renderHook(() => useEditCommentController((state) => state));

    act(() => {
      result.current.actions.editComment(payload);
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(spyCallApi).toBeCalled();
    expect(showToast).toBeCalled();
    expect(setCreateComment).toBeCalledTimes(2);
  });

  it('should do nothing if id undefined:', () => {
    const payload: IPayloadPutEditComment = {
      id: '',
      comment: mockComment,
      data: mockDataEdit,
    };
    const spyCallApi = jest
      .spyOn(streamApi, 'putEditComment')
      .mockImplementation(() => Promise.resolve(true) as any);

    const { result } = renderHook(() => useEditCommentController((state) => state));
    act(() => {
      result.current.actions.editComment(payload);
    });

    expect(spyCallApi).not.toBeCalled();
  });

  it('should do nothing if comment undefined:', () => {
    const payload: IPayloadPutEditComment = {
      id: mockId,
      comment: null,
      data: mockDataEdit,
    };
    const spyCallApi = jest
      .spyOn(streamApi, 'putEditComment')
      .mockImplementation(() => Promise.resolve(true) as any);

    const { result } = renderHook(() => useEditCommentController((state) => state));
    act(() => {
      result.current.actions.editComment(payload);
    });

    expect(spyCallApi).not.toBeCalled();
  });

  it('should do nothing if data undefined:', () => {
    const payload: IPayloadPutEditComment = {
      id: mockId,
      comment: mockComment,
      data: null,
    };
    const spyCallApi = jest
      .spyOn(streamApi, 'putEditComment')
      .mockImplementation(() => Promise.resolve(true) as any);

    const { result } = renderHook(() => useEditCommentController((state) => state));
    act(() => {
      result.current.actions.editComment(payload);
    });

    expect(spyCallApi).not.toBeCalled();
  });

  it('should edit comment throw error:', () => {
    const error = 'error';
    const payload: IPayloadPutEditComment = {
      id: mockId,
      comment: mockComment,
      data: mockDataEdit,
    };
    const spyCallApi = jest
      .spyOn(streamApi, 'putEditComment')
      .mockImplementation(() => Promise.reject(error) as any);

    const setCreateComment = jest.fn();
    jest.spyOn(useCommentInputStore, 'getState').mockImplementation(() => ({ actions: { setCreateComment } } as any));

    const showToast = jest.fn();
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions: { showToast } } as any));

    jest.useFakeTimers();

    const { result } = renderHook(() => useEditCommentController((state) => state));

    act(() => {
      try {
        result.current.actions.editComment(payload);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(spyCallApi).toBeCalled();
    expect(showToast).toHaveBeenCalledWith({ content: 'common:text_error_message', type: ToastType.ERROR });
    expect(setCreateComment).toBeCalledTimes(2);
  });
});
