import { act, renderHook, waitFor } from '@testing-library/react-native';
import i18next from 'i18next';
import usePostMenu from './usePostMenu';
import { mockGenerateQuizResponse, postWithQuiz } from '~/test/mock_data/quiz';
import useMyPermissionsStore from '~/store/permissions';
import { PermissionKey } from '~/constants/permissionScheme';
import useModalStore from '~/store/modal';
import { IPost } from '~/interfaces/IPost';
import * as navigationHook from '~/hooks/navigation';
import streamApi from '~/api/StreamApi';
import quizStack from '~/router/navigator/MainStack/stacks/quizStack/stack';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';

describe('usePostMenu', () => {
  const doMockPermissions = () => {
    useMyPermissionsStore.setState((state) => ({
      ...state,
      data: {
        ...state.data,
        groups: {
          '18508ac3-2bfc-4172-b071-1d67f1b1e05b': [
            PermissionKey.CRUD_POST_ARTICLE,
            PermissionKey.EDIT_OWN_CONTENT_SETTING,
            PermissionKey.FULL_PERMISSION,
            PermissionKey.PIN_CONTENT,
          ],
          'aeab68c2-bcec-4edb-a78b-60c0ee90afd7': [
            PermissionKey.CRUD_POST_ARTICLE,
            PermissionKey.EDIT_OWN_CONTENT_SETTING,
            PermissionKey.FULL_PERMISSION,
            PermissionKey.PIN_CONTENT,
          ],
          'b01fb58e-9299-4a0e-a55f-9839293fb42a': [
            PermissionKey.CRUD_POST_ARTICLE,
            PermissionKey.EDIT_OWN_CONTENT_SETTING,
            PermissionKey.FULL_PERMISSION,
            PermissionKey.PIN_CONTENT,
          ],
        },
      },
    }));
  };

  it('should show post menu', async () => {
    doMockPermissions();

    const { result } = renderHook(() => usePostMenu(postWithQuiz.data as IPost, true, false));

    act(() => {
      result.current.showMenu();
    });

    await waitFor(() => {
      expect(useModalStore.getState().bottomList.isOpen).toBeTruthy();
      expect(useModalStore.getState().bottomList.data).toBeTruthy();
    });
  });

  it('should delete quiz', async () => {
    const mockQuizAction = {
      deleteQuiz: jest.fn(),
    };
    const actual = jest.requireActual('~/store/entities/quizzes');
    jest.spyOn(actual, 'default').mockReturnValueOnce(mockQuizAction);

    doMockPermissions();

    const { result } = renderHook(() => usePostMenu(postWithQuiz.data as IPost, true, false));

    act(() => {
      result.current.showMenu();
    });

    await waitFor(() => {
      expect(useModalStore.getState().bottomList.isOpen).toBeTruthy();
      expect(useModalStore.getState().bottomList.data).toBeTruthy();
    });

    const btnDeleteQuiz = useModalStore
      .getState()
      .bottomList.data.find((item: any) => item.id === 12);

    expect(btnDeleteQuiz).toBeDefined();

    act(() => {
      btnDeleteQuiz.onPress();
    });

    await waitFor(() => {
      expect(useModalStore.getState().alert.onConfirm).toBeDefined();
    });

    act(() => {
      useModalStore.getState().alert.onConfirm();
    });

    await waitFor(() => {
      expect(mockQuizAction.deleteQuiz).toBeCalled();
    });
  });

  it('should delete post', async () => {
    const mockPostAction = {
      deletePost: jest.fn(),
    };
    const actual = jest.requireActual('~/store/entities/posts');
    jest.spyOn(actual, 'default').mockReturnValueOnce(mockPostAction);

    doMockPermissions();

    const { result } = renderHook(() => usePostMenu(postWithQuiz.data as IPost, true, false));

    act(() => {
      result.current.showMenu();
    });

    await waitFor(() => {
      expect(useModalStore.getState().bottomList.isOpen).toBeTruthy();
      expect(useModalStore.getState().bottomList.data).toBeTruthy();
    });

    const btnDeletePost = useModalStore
      .getState()
      .bottomList.data.find((item: any) => item.id === 13);

    expect(btnDeletePost).toBeDefined();

    act(() => {
      btnDeletePost.onPress();
    });

    await waitFor(() => {
      expect(useModalStore.getState().alert.onConfirm).toBeDefined();
    });

    act(() => {
      useModalStore.getState().alert.onConfirm();
    });

    await waitFor(() => {
      expect(mockPostAction.deletePost).toBeCalled();
    });
  });

  it('should edit quiz', async () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest
      .spyOn(navigationHook, 'useRootNavigation')
      .mockImplementation(() => ({ rootNavigation } as any));
    jest
      .spyOn(streamApi, 'getQuizDetail')
      .mockImplementation(
        () => Promise.resolve(mockGenerateQuizResponse) as any,
      );

    doMockPermissions();

    const { result } = renderHook(() => usePostMenu(postWithQuiz.data as IPost, true, false));

    act(() => {
      result.current.showMenu();
    });

    await waitFor(() => {
      expect(useModalStore.getState().bottomList.isOpen).toBeTruthy();
      expect(useModalStore.getState().bottomList.data).toBeTruthy();
    });

    const btnEditQuiz = useModalStore
      .getState()
      .bottomList.data.find((item: any) => item.id === 11);

    expect(btnEditQuiz).toBeDefined();

    act(() => {
      btnEditQuiz.onPress();
    });

    await waitFor(() => {
      expect(useModalStore.getState().alert.onConfirm).toBeDefined();
    });

    act(() => {
      useModalStore.getState().alert.onConfirm();
    });

    await waitFor(() => {
      expect(navigate.mock.calls[0][0]).toBe(quizStack.composeQuiz);
    });
  });

  it('should create quiz', async () => {
    const { quiz, ...postNoQuiz } = postWithQuiz.data;
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest
      .spyOn(navigationHook, 'useRootNavigation')
      .mockImplementation(() => ({ rootNavigation } as any));

    doMockPermissions();

    const { result } = renderHook(() => usePostMenu(postNoQuiz as IPost, true, false));

    act(() => {
      result.current.showMenu();
    });

    await waitFor(() => {
      expect(useModalStore.getState().bottomList.isOpen).toBeTruthy();
      expect(useModalStore.getState().bottomList.data).toBeTruthy();
    });

    const btnCreateQuiz = useModalStore
      .getState()
      .bottomList.data.find((item: any) => item.id === 10);

    expect(btnCreateQuiz).toBeDefined();

    act(() => {
      btnCreateQuiz.onPress();
    });

    await waitFor(() => {
      expect(navigate.mock.calls[0][0]).toBe(quizStack.entryQuiz);
    });
  });

  it('should report post', async () => {
    const { result } = renderHook(() => usePostMenu(postWithQuiz.data as IPost, false, false));

    act(() => {
      result.current.showMenu();
    });

    await waitFor(() => {
      expect(useModalStore.getState().bottomList.isOpen).toBeTruthy();
      expect(useModalStore.getState().bottomList.data).toBeTruthy();
    });

    const btnReport = useModalStore
      .getState()
      .bottomList.data.find((item: any) => item.id === 8);

    expect(btnReport).toBeDefined();

    act(() => {
      btnReport.onPress();
    });

    await waitFor(() => {
      expect(useModalStore.getState().modal.isOpen).toBeTruthy();
    });
  });

  it('should pin content', async () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest
      .spyOn(navigationHook, 'useRootNavigation')
      .mockImplementation(() => ({ rootNavigation } as any));

    doMockPermissions();

    const { result } = renderHook(() => usePostMenu(postWithQuiz.data as IPost, false, false));

    act(() => {
      result.current.showMenu();
    });

    await waitFor(() => {
      expect(useModalStore.getState().bottomList.isOpen).toBeTruthy();
      expect(useModalStore.getState().bottomList.data).toBeTruthy();
    });

    const btnPin = useModalStore
      .getState()
      .bottomList.data.find((item: any) => item.id === 7);

    expect(btnPin).toBeDefined();

    act(() => {
      btnPin.onPress();
    });

    await waitFor(() => {
      expect(navigate.mock.calls[0][0]).toBe(homeStack.pinContent);
    });
  });

  it('should view series', async () => {
    const { result } = renderHook(() => usePostMenu(postWithQuiz.data as IPost, false, false));

    act(() => {
      result.current.showMenu();
    });

    await waitFor(() => {
      expect(useModalStore.getState().bottomList.isOpen).toBeTruthy();
      expect(useModalStore.getState().bottomList.data).toBeTruthy();
    });

    const btnViewSeries = useModalStore
      .getState()
      .bottomList.data.find((item: any) => item.id === 6);

    expect(btnViewSeries).toBeDefined();

    act(() => {
      btnViewSeries.onPress();
    });

    await waitFor(() => {
      expect(useModalStore.getState().modal.titleFullScreen).toBe(
        i18next.t('common:btn_view_series'),
      );
    });
  });

  it('should view reaction', async () => {
    const { result } = renderHook(() => usePostMenu(postWithQuiz.data as IPost, false, false));

    act(() => {
      result.current.showMenu();
    });

    await waitFor(() => {
      expect(useModalStore.getState().bottomList.isOpen).toBeTruthy();
      expect(useModalStore.getState().bottomList.data).toBeTruthy();
    });

    const btnViewReaction = useModalStore
      .getState()
      .bottomList.data.find((item: any) => item.id === 5);

    expect(btnViewReaction).toBeDefined();

    act(() => {
      btnViewReaction.onPress();
    });

    await waitFor(() => {
      expect(
        useModalStore.getState().reactionDetailBottomSheet.isOpen,
      ).toBeTruthy();
    });
  });

  it('should copy link', async () => {
    const { result } = renderHook(() => usePostMenu(postWithQuiz.data as IPost, false, false));

    act(() => {
      result.current.showMenu();
    });

    await waitFor(() => {
      expect(useModalStore.getState().bottomList.isOpen).toBeTruthy();
      expect(useModalStore.getState().bottomList.data).toBeTruthy();
    });

    const btnCopyLink = useModalStore
      .getState()
      .bottomList.data.find((item: any) => item.id === 4);

    expect(btnCopyLink).toBeDefined();

    act(() => {
      btnCopyLink.onPress();
    });

    await waitFor(() => {
      expect(useModalStore.getState().toast.content).toBe(
        'common:text_link_copied_to_clipboard',
      );
    });
  });

  it('should save post', async () => {
    const commonActions = {
      savePost: jest.fn(),
    };
    const actual = jest.requireActual('~/screens/store');
    jest.spyOn(actual, 'default').mockReturnValueOnce(commonActions);
    const { result } = renderHook(() => usePostMenu(postWithQuiz.data as IPost, false, false));

    act(() => {
      result.current.showMenu();
    });

    await waitFor(() => {
      expect(useModalStore.getState().bottomList.isOpen).toBeTruthy();
      expect(useModalStore.getState().bottomList.data).toBeTruthy();
    });

    const btnSavePost = useModalStore
      .getState()
      .bottomList.data.find((item: any) => item.id === 3);

    expect(btnSavePost).toBeDefined();

    act(() => {
      btnSavePost.onPress();
    });

    await waitFor(() => {
      expect(commonActions.savePost).toBeCalled();
    });
  });

  it('should unsave post', async () => {
    const commonActions = {
      unsavePost: jest.fn(),
    };
    const actual = jest.requireActual('~/screens/store');
    jest.spyOn(actual, 'default').mockReturnValueOnce(commonActions);
    const { result } = renderHook(() => usePostMenu(
        { ...postWithQuiz.data, isSaved: true } as IPost,
        false,
        false,
    ));

    act(() => {
      result.current.showMenu();
    });

    await waitFor(() => {
      expect(useModalStore.getState().bottomList.isOpen).toBeTruthy();
      expect(useModalStore.getState().bottomList.data).toBeTruthy();
    });

    const btnUnsavePost = useModalStore
      .getState()
      .bottomList.data.find((item: any) => item.id === 3);

    expect(btnUnsavePost).toBeDefined();

    act(() => {
      btnUnsavePost.onPress();
    });

    await waitFor(() => {
      expect(commonActions.unsavePost).toBeCalled();
    });
  });

  it('should edit setting', async () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest
      .spyOn(navigationHook, 'useRootNavigation')
      .mockImplementation(() => ({ rootNavigation } as any));

    doMockPermissions();

    const { result } = renderHook(() => usePostMenu(postWithQuiz.data as IPost, false, false));

    act(() => {
      result.current.showMenu();
    });

    await waitFor(() => {
      expect(useModalStore.getState().bottomList.isOpen).toBeTruthy();
      expect(useModalStore.getState().bottomList.data).toBeTruthy();
    });

    const btnEditSetting = useModalStore
      .getState()
      .bottomList.data.find((item: any) => item.id === 2);

    expect(btnEditSetting).toBeDefined();

    act(() => {
      btnEditSetting.onPress();
    });

    await waitFor(() => {
      expect(navigate.mock.calls[0][0]).toBe(homeStack.postSettings);
    });
  });

  it('should edit post', async () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest
      .spyOn(navigationHook, 'useRootNavigation')
      .mockImplementation(() => ({ rootNavigation } as any));

    const { result } = renderHook(() => usePostMenu(postWithQuiz.data as IPost, true, false));

    act(() => {
      result.current.showMenu();
    });

    await waitFor(() => {
      expect(useModalStore.getState().bottomList.isOpen).toBeTruthy();
      expect(useModalStore.getState().bottomList.data).toBeTruthy();
    });

    const btnEditPost = useModalStore
      .getState()
      .bottomList.data.find((item: any) => item.id === 1);

    expect(btnEditPost).toBeDefined();

    act(() => {
      btnEditPost.onPress();
    });

    await waitFor(() => {
      expect(navigate.mock.calls[0][0]).toBe(homeStack.createPost);
    });
  });
});
