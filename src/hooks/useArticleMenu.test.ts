// import { act, renderHook, waitFor } from '@testing-library/react-native';
// import i18next from 'i18next';
// import useArticleMenu from './useArticleMenu';
// import { articleWithQuiz, mockGenerateQuizResponse } from '~/test/mock_data/quiz';
// import useMyPermissionsStore from '~/store/permissions';
// import { PermissionKey } from '~/constants/permissionScheme';
// import useModalStore from '~/store/modal';
// import { IPost } from '~/interfaces/IPost';
// import * as navigationHook from '~/hooks/navigation';
// import streamApi from '~/api/StreamApi';
// import quizStack from '~/router/navigator/MainStack/stacks/quizStack/stack';
// import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
// import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';

// describe('useArticleMenu', () => {
//   const doMockPermissions = () => {
//     useMyPermissionsStore.setState((state) => ({
//       ...state,
//       data: {
//         ...state.data,
//         groups: {
//           'c8ddd4d4-9a5e-4d93-940b-e332a8d0422d': [
//             PermissionKey.CRUD_POST_ARTICLE,
//             PermissionKey.EDIT_OWN_CONTENT_SETTING,
//             PermissionKey.FULL_PERMISSION,
//             PermissionKey.PIN_CONTENT,
//           ],
//         },
//       },
//     }));
//   };

//   it('should show post menu', async () => {
//     doMockPermissions();

//     const { result } = renderHook(() => useArticleMenu(articleWithQuiz.data as IPost, true));

//     act(() => {
//       result.current.showMenu();
//     });

//     await waitFor(() => {
//       expect(useModalStore.getState().bottomList.isOpen).toBeTruthy();
//       expect(useModalStore.getState().bottomList.data).toBeTruthy();
//     });
//   });

//   it('should delete quiz', async () => {
//     const mockQuizAction = {
//       deleteQuiz: jest.fn(),
//     };
//     const actual = jest.requireActual('~/store/entities/quizzes');
//     jest.spyOn(actual, 'default').mockReturnValueOnce(mockQuizAction);

//     doMockPermissions();

//     const { result } = renderHook(() => useArticleMenu(articleWithQuiz.data as IPost, true));

//     act(() => {
//       result.current.showMenu();
//     });

//     await waitFor(() => {
//       expect(useModalStore.getState().bottomList.isOpen).toBeTruthy();
//       expect(useModalStore.getState().bottomList.data).toBeTruthy();
//     });

//     const btnDeleteQuiz = useModalStore
//       .getState()
//       .bottomList.data.find((item: any) => item.id === 12);

//     expect(btnDeleteQuiz).toBeDefined();

//     act(() => {
//       btnDeleteQuiz.onPress();
//     });

//     await waitFor(() => {
//       expect(useModalStore.getState().alert.onConfirm).toBeDefined();
//     });

//     act(() => {
//       useModalStore.getState().alert.onConfirm();
//     });

//     await waitFor(() => {
//       expect(mockQuizAction.deleteQuiz).toBeCalled();
//     });
//   });

//   it('should delete article', async () => {
//     const mockArticleAction = {
//       deleteArticle: jest.fn(),
//     };
//     const actual = jest.requireActual('~/screens/articles/store');
//     jest.spyOn(actual, 'default').mockReturnValueOnce(mockArticleAction);

//     doMockPermissions();

//     const { result } = renderHook(() => useArticleMenu(articleWithQuiz.data as IPost, true));

//     act(() => {
//       result.current.showMenu();
//     });

//     await waitFor(() => {
//       expect(useModalStore.getState().bottomList.isOpen).toBeTruthy();
//       expect(useModalStore.getState().bottomList.data).toBeTruthy();
//     });

//     const btnDeleteArticle = useModalStore
//       .getState()
//       .bottomList.data.find((item: any) => item.id === 13);

//     expect(btnDeleteArticle).toBeDefined();

//     act(() => {
//       btnDeleteArticle.onPress();
//     });

//     await waitFor(() => {
//       expect(useModalStore.getState().alert.onConfirm).toBeDefined();
//     });

//     act(() => {
//       useModalStore.getState().alert.onConfirm();
//     });

//     await waitFor(() => {
//       expect(mockArticleAction.deleteArticle).toBeCalled();
//     });
//   });

//   it('should edit quiz', async () => {
//     const navigate = jest.fn();
//     const rootNavigation = { navigate };
//     jest
//       .spyOn(navigationHook, 'useRootNavigation')
//       .mockImplementation(() => ({ rootNavigation } as any));
//     jest
//       .spyOn(streamApi, 'getQuizDetail')
//       .mockImplementation(
//         () => Promise.resolve(mockGenerateQuizResponse) as any,
//       );

//     doMockPermissions();

//     const { result } = renderHook(() => useArticleMenu(articleWithQuiz.data as IPost, true));

//     act(() => {
//       result.current.showMenu();
//     });

//     await waitFor(() => {
//       expect(useModalStore.getState().bottomList.isOpen).toBeTruthy();
//       expect(useModalStore.getState().bottomList.data).toBeTruthy();
//     });

//     const btnEditQuiz = useModalStore
//       .getState()
//       .bottomList.data.find((item: any) => item.id === 11);

//     expect(btnEditQuiz).toBeDefined();

//     act(() => {
//       btnEditQuiz.onPress();
//     });

//     await waitFor(() => {
//       expect(useModalStore.getState().alert.onConfirm).toBeDefined();
//     });

//     act(() => {
//       useModalStore.getState().alert.onConfirm();
//     });

//     await waitFor(() => {
//       expect(navigate.mock.calls[0][0]).toBe(quizStack.composeQuiz);
//     });
//   });

//   it('should create quiz', async () => {
//     const { quiz, ...articleNoQuiz } = articleWithQuiz.data;
//     const navigate = jest.fn();
//     const rootNavigation = { navigate };
//     jest
//       .spyOn(navigationHook, 'useRootNavigation')
//       .mockImplementation(() => ({ rootNavigation } as any));

//     doMockPermissions();

//     const { result } = renderHook(() => useArticleMenu(articleNoQuiz as IPost, true));

//     act(() => {
//       result.current.showMenu();
//     });

//     await waitFor(() => {
//       expect(useModalStore.getState().bottomList.isOpen).toBeTruthy();
//       expect(useModalStore.getState().bottomList.data).toBeTruthy();
//     });

//     const btnCreateQuiz = useModalStore
//       .getState()
//       .bottomList.data.find((item: any) => item.id === 10);

//     expect(btnCreateQuiz).toBeDefined();

//     act(() => {
//       btnCreateQuiz.onPress();
//     });

//     await waitFor(() => {
//       expect(navigate.mock.calls[0][0]).toBe(quizStack.entryQuiz);
//     });
//   });

//   it('should report post', async () => {
//     const { result } = renderHook(() => useArticleMenu(articleWithQuiz.data as IPost, false));

//     act(() => {
//       result.current.showMenu();
//     });

//     await waitFor(() => {
//       expect(useModalStore.getState().bottomList.isOpen).toBeTruthy();
//       expect(useModalStore.getState().bottomList.data).toBeTruthy();
//     });

//     const btnReport = useModalStore
//       .getState()
//       .bottomList.data.find((item: any) => item.id === 8);

//     expect(btnReport).toBeDefined();

//     act(() => {
//       btnReport.onPress();
//     });

//     await waitFor(() => {
//       expect(useModalStore.getState().modal.isOpen).toBeTruthy();
//     });
//   });

//   it('should pin content', async () => {
//     const navigate = jest.fn();
//     const rootNavigation = { navigate };
//     jest
//       .spyOn(navigationHook, 'useRootNavigation')
//       .mockImplementation(() => ({ rootNavigation } as any));

//     doMockPermissions();

//     const { result } = renderHook(() => useArticleMenu(articleWithQuiz.data as IPost, false));

//     act(() => {
//       result.current.showMenu();
//     });

//     await waitFor(() => {
//       expect(useModalStore.getState().bottomList.isOpen).toBeTruthy();
//       expect(useModalStore.getState().bottomList.data).toBeTruthy();
//     });

//     const btnPin = useModalStore
//       .getState()
//       .bottomList.data.find((item: any) => item.id === 7);

//     expect(btnPin).toBeDefined();

//     act(() => {
//       btnPin.onPress();
//     });

//     await waitFor(() => {
//       expect(navigate.mock.calls[0][0]).toBe(homeStack.pinContent);
//     });
//   });

//   it('should view series', async () => {
//     const { result } = renderHook(() => useArticleMenu(articleWithQuiz.data as IPost, false));

//     act(() => {
//       result.current.showMenu();
//     });

//     await waitFor(() => {
//       expect(useModalStore.getState().bottomList.isOpen).toBeTruthy();
//       expect(useModalStore.getState().bottomList.data).toBeTruthy();
//     });

//     const btnViewSeries = useModalStore
//       .getState()
//       .bottomList.data.find((item: any) => item.id === 6);

//     expect(btnViewSeries).toBeDefined();

//     act(() => {
//       btnViewSeries.onPress();
//     });

//     await waitFor(() => {
//       expect(useModalStore.getState().modal.titleFullScreen).toBe(
//         i18next.t('common:btn_view_series'),
//       );
//     });
//   });

//   it('should view reaction', async () => {
//     const { result } = renderHook(() => useArticleMenu(articleWithQuiz.data as IPost, false));

//     act(() => {
//       result.current.showMenu();
//     });

//     await waitFor(() => {
//       expect(useModalStore.getState().bottomList.isOpen).toBeTruthy();
//       expect(useModalStore.getState().bottomList.data).toBeTruthy();
//     });

//     const btnViewReaction = useModalStore
//       .getState()
//       .bottomList.data.find((item: any) => item.id === 5);

//     expect(btnViewReaction).toBeDefined();

//     act(() => {
//       btnViewReaction.onPress();
//     });

//     await waitFor(() => {
//       expect(
//         useModalStore.getState().reactionDetailBottomSheet.isOpen,
//       ).toBeTruthy();
//     });
//   });

//   it('should copy link', async () => {
//     const { result } = renderHook(() => useArticleMenu(articleWithQuiz.data as IPost, false));

//     act(() => {
//       result.current.showMenu();
//     });

//     await waitFor(() => {
//       expect(useModalStore.getState().bottomList.isOpen).toBeTruthy();
//       expect(useModalStore.getState().bottomList.data).toBeTruthy();
//     });

//     const btnCopyLink = useModalStore
//       .getState()
//       .bottomList.data.find((item: any) => item.id === 4);

//     expect(btnCopyLink).toBeDefined();

//     act(() => {
//       btnCopyLink.onPress();
//     });

//     await waitFor(() => {
//       expect(useModalStore.getState().toast.content).toBe(
//         'common:text_link_copied_to_clipboard',
//       );
//     });
//   });

//   it('should save article', async () => {
//     const commonActions = {
//       savePost: jest.fn(),
//     };
//     const actual = jest.requireActual('~/screens/store');
//     jest.spyOn(actual, 'default').mockReturnValueOnce(commonActions);
//     const { result } = renderHook(() => useArticleMenu(articleWithQuiz.data as IPost, false));

//     act(() => {
//       result.current.showMenu();
//     });

//     await waitFor(() => {
//       expect(useModalStore.getState().bottomList.isOpen).toBeTruthy();
//       expect(useModalStore.getState().bottomList.data).toBeTruthy();
//     });

//     const btnSaveArticle = useModalStore
//       .getState()
//       .bottomList.data.find((item: any) => item.id === 3);

//     expect(btnSaveArticle).toBeDefined();

//     act(() => {
//       btnSaveArticle.onPress();
//     });

//     await waitFor(() => {
//       expect(commonActions.savePost).toBeCalled();
//     });
//   });

//   it('should unsave article', async () => {
//     const commonActions = {
//       unsavePost: jest.fn(),
//     };
//     const actual = jest.requireActual('~/screens/store');
//     jest.spyOn(actual, 'default').mockReturnValueOnce(commonActions);

//     const { result } = renderHook(() => useArticleMenu(
//           { ...articleWithQuiz.data, isSaved: true } as IPost,
//           false,
//     ));

//     act(() => {
//       result.current.showMenu();
//     });

//     await waitFor(() => {
//       expect(useModalStore.getState().bottomList.isOpen).toBeTruthy();
//       expect(useModalStore.getState().bottomList.data).toBeTruthy();
//     });

//     const btnUnsaveArticle = useModalStore
//       .getState()
//       .bottomList.data.find((item: any) => item.id === 3);

//     expect(btnUnsaveArticle).toBeDefined();

//     act(() => {
//       btnUnsaveArticle.onPress();
//     });

//     await waitFor(() => {
//       expect(commonActions.unsavePost).toBeCalled();
//     });
//   });

//   it('should edit setting', async () => {
//     const navigate = jest.fn();
//     const rootNavigation = { navigate };
//     jest
//       .spyOn(navigationHook, 'useRootNavigation')
//       .mockImplementation(() => ({ rootNavigation } as any));

//     doMockPermissions();

//     const { result } = renderHook(() => useArticleMenu(articleWithQuiz.data as IPost, false));

//     act(() => {
//       result.current.showMenu();
//     });

//     await waitFor(() => {
//       expect(useModalStore.getState().bottomList.isOpen).toBeTruthy();
//       expect(useModalStore.getState().bottomList.data).toBeTruthy();
//     });

//     const btnEditSetting = useModalStore
//       .getState()
//       .bottomList.data.find((item: any) => item.id === 2);

//     expect(btnEditSetting).toBeDefined();

//     act(() => {
//       btnEditSetting.onPress();
//     });

//     await waitFor(() => {
//       expect(navigate.mock.calls[0][0]).toBe(articleStack.createArticleSettings);
//     });
//   });

//   it('should edit post', async () => {
//     const navigate = jest.fn();
//     const rootNavigation = { navigate };
//     jest
//       .spyOn(navigationHook, 'useRootNavigation')
//       .mockImplementation(() => ({ rootNavigation } as any));

//     const { result } = renderHook(() => useArticleMenu(articleWithQuiz.data as IPost, true));

//     act(() => {
//       result.current.showMenu();
//     });

//     await waitFor(() => {
//       expect(useModalStore.getState().bottomList.isOpen).toBeTruthy();
//       expect(useModalStore.getState().bottomList.data).toBeTruthy();
//     });

//     const btnEditPost = useModalStore
//       .getState()
//       .bottomList.data.find((item: any) => item.id === 1);

//     expect(btnEditPost).toBeDefined();

//     act(() => {
//       btnEditPost.onPress();
//     });

//     await waitFor(() => {
//       expect(navigate.mock.calls[0][0]).toBe(articleStack.createArticle);
//     });
//   });
// });
