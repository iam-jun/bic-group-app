// /* eslint-disable @typescript-eslint/no-empty-function */
// import { act, renderHook, waitFor } from '@testing-library/react-native';
// import useSeriesMenu from './useSeriesMenu';
// import useMyPermissionsStore from '~/store/permissions';
// import { PermissionKey } from '~/constants/permissionScheme';
// import useModalStore from '~/store/modal';
// import { IPost } from '~/interfaces/IPost';
// import { seriesDetail } from '~/test/mock_data/series';
// import * as navigationHook from '~/hooks/navigation';
// import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
// import seriesStack from '~/router/navigator/MainStack/stacks/series/stack';

// describe('useSeriesMenu', () => {
//   const doMockPermissions = () => {
//     useMyPermissionsStore.setState((state) => ({
//       ...state,
//       data: {
//         ...state.data,
//         groups: {
//           'f84e82b5-18c6-4291-8f3a-9bf4da714e99': [
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

//     const { result } = renderHook(() => useSeriesMenu(seriesDetail.data as IPost, true, true, () => {}));

//     act(() => {
//       result.current.showMenu();
//     });

//     await waitFor(() => {
//       expect(useModalStore.getState().bottomList.isOpen).toBeTruthy();
//       expect(useModalStore.getState().bottomList.data).toBeTruthy();
//     });
//   });

//   it('should delete series', async () => {
//     const handleConfirmDelete = jest.fn();

//     const { result } = renderHook(() => useSeriesMenu(seriesDetail.data as IPost, true, true, handleConfirmDelete));

//     act(() => {
//       result.current.showMenu();
//     });

//     await waitFor(() => {
//       expect(useModalStore.getState().bottomList.isOpen).toBeTruthy();
//       expect(useModalStore.getState().bottomList.data).toBeTruthy();
//     });

//     const btnDeleteSeries = useModalStore
//       .getState()
//       .bottomList.data.find((item: any) => item.id === 6);

//     expect(btnDeleteSeries).toBeDefined();

//     act(() => {
//       btnDeleteSeries.onPress();
//     });

//     await waitFor(() => {
//       expect(useModalStore.getState().alert.onConfirm).toBeDefined();
//     });

//     act(() => {
//       useModalStore.getState().alert.onConfirm();
//     });

//     await waitFor(() => {
//       expect(handleConfirmDelete).toBeCalled();
//     });
//   });

//   it('should pin content', async () => {
//     const navigate = jest.fn();
//     const rootNavigation = { navigate };
//     jest
//       .spyOn(navigationHook, 'useRootNavigation')
//       .mockImplementation(() => ({ rootNavigation } as any));

//     doMockPermissions();

//     const { result } = renderHook(() => useSeriesMenu(seriesDetail.data as IPost, true, true, () => {}));

//     act(() => {
//       result.current.showMenu();
//     });

//     await waitFor(() => {
//       expect(useModalStore.getState().bottomList.isOpen).toBeTruthy();
//       expect(useModalStore.getState().bottomList.data).toBeTruthy();
//     });

//     const btnPin = useModalStore
//       .getState()
//       .bottomList.data.find((item: any) => item.id === 5);

//     expect(btnPin).toBeDefined();

//     act(() => {
//       btnPin.onPress();
//     });

//     await waitFor(() => {
//       expect(navigate.mock.calls[0][0]).toBe(homeStack.pinContent);
//     });
//   });

//   it('should copy link', async () => {
//     const { result } = renderHook(() => useSeriesMenu(seriesDetail.data as IPost, true, true, () => {}));

//     act(() => {
//       result.current.showMenu();
//     });

//     await waitFor(() => {
//       expect(useModalStore.getState().bottomList.isOpen).toBeTruthy();
//       expect(useModalStore.getState().bottomList.data).toBeTruthy();
//     });

//     const btnCopyLink = useModalStore
//       .getState()
//       .bottomList.data.find((item: any) => item.id === 3);

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

//   it('should save series', async () => {
//     const commonActions = {
//       savePost: jest.fn(),
//     };
//     const actual = jest.requireActual('~/screens/store');
//     jest.spyOn(actual, 'default').mockReturnValueOnce(commonActions);

//     const { result } = renderHook(() => useSeriesMenu(seriesDetail.data as IPost, true, true, () => {}));

//     act(() => {
//       result.current.showMenu();
//     });

//     await waitFor(() => {
//       expect(useModalStore.getState().bottomList.isOpen).toBeTruthy();
//       expect(useModalStore.getState().bottomList.data).toBeTruthy();
//     });

//     const btnSaveSeries = useModalStore
//       .getState()
//       .bottomList.data.find((item: any) => item.id === 4);

//     expect(btnSaveSeries).toBeDefined();

//     act(() => {
//       btnSaveSeries.onPress();
//     });

//     await waitFor(() => {
//       expect(commonActions.savePost).toBeCalled();
//     });
//   });

//   it('should unsave series', async () => {
//     const commonActions = {
//       unsavePost: jest.fn(),
//     };
//     const actual = jest.requireActual('~/screens/store');
//     jest.spyOn(actual, 'default').mockReturnValueOnce(commonActions);

//     const { result } = renderHook(() => useSeriesMenu(
//         { ...seriesDetail.data, isSaved: true } as IPost,
//         true,
//         true,
//         () => {},
//     ));

//     act(() => {
//       result.current.showMenu();
//     });

//     await waitFor(() => {
//       expect(useModalStore.getState().bottomList.isOpen).toBeTruthy();
//       expect(useModalStore.getState().bottomList.data).toBeTruthy();
//     });

//     const btnUnsaveSeries = useModalStore
//       .getState()
//       .bottomList.data.find((item: any) => item.id === 4);

//     expect(btnUnsaveSeries).toBeDefined();

//     act(() => {
//       btnUnsaveSeries.onPress();
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

//     const { result } = renderHook(() => useSeriesMenu(seriesDetail.data as IPost, true, true, () => {}));
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
//       expect(navigate.mock.calls[0][0]).toBe(seriesStack.seriesSettings);
//     });
//   });

//   it('should edit series', async () => {
//     const navigate = jest.fn();
//     const rootNavigation = { navigate };
//     jest
//       .spyOn(navigationHook, 'useRootNavigation')
//       .mockImplementation(() => ({ rootNavigation } as any));

//     const { result } = renderHook(() => useSeriesMenu(seriesDetail.data as IPost, true, true, () => {}));

//     act(() => {
//       result.current.showMenu();
//     });

//     await waitFor(() => {
//       expect(useModalStore.getState().bottomList.isOpen).toBeTruthy();
//       expect(useModalStore.getState().bottomList.data).toBeTruthy();
//     });

//     const btnEditSeries = useModalStore
//       .getState()
//       .bottomList.data.find((item: any) => item.id === 1);

//     expect(btnEditSeries).toBeDefined();

//     act(() => {
//       btnEditSeries.onPress();
//     });

//     await waitFor(() => {
//       expect(navigate.mock.calls[0][0]).toBe(seriesStack.createSeries);
//     });
//   });
// });
