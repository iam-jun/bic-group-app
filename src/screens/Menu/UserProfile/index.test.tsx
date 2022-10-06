/* eslint-disable @typescript-eslint/no-var-requires */

import { cleanup } from '@testing-library/react-native';

afterEach(cleanup);

describe('UserProfile screen', () => {
  // const mockStore = configureStore([]);
  // let storeData: any;

  // beforeEach(() => {
  //   jest.clearAllMocks();
  //   storeData = { ...initialState };
  //   storeData.menu.myProfile = {} as any;
  //   storeData.auth.user = {} as any;
  //   storeData.menu.showUserNotFound = false;
  //   storeData.menu.loadingUserProfile = false;
  // });

  // it('should show edit profile button correctly', () => {
  //   const mockActionGetMyProfile = () => ({
  //     type: menuTypes.SET_USER_PROFILE,
  //     payload: USER_PROFILE,
  //   });

  //   jest
  //     .spyOn(menuActions, 'getUserProfile')
  //     .mockImplementation(mockActionGetMyProfile as any);
  //   const user = {
  //     signInUserSession: {
  //       idToken: { payload: { 'custom:user_uuid': USER_PROFILE.id } },
  //     },
  //   };

  //   storeData.menu.myProfile = USER_PROFILE as any;
  //   storeData.auth.user = user as any;

  //   const store = createTestStore(storeData);
  //   const props = { route: { params: { userId: USER_PROFILE.id } } };
  //   const wrapper = renderWithRedux(<UserProfile {...props} />, store);

  //   const buttonEditUserProfile = wrapper.queryByTestId('user_profile.edit');
  //   expect(buttonEditUserProfile).toBeDefined();

  //   const buttonSendMessage = wrapper.queryByTestId('header.icon_chat');
  //   expect(buttonSendMessage).toBeNull();
  // });

  // it('should navigate to UserEditProfile screen when click button edit profile', () => {
  //   const navigate = jest.fn();
  //   const rootNavigation = { navigate };

  //   jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

  //   const mockActionGetMyProfile = () => ({
  //     type: menuTypes.SET_USER_PROFILE,
  //     payload: USER_PROFILE,
  //   });

  //   jest
  //     .spyOn(menuActions, 'getUserProfile')
  //     .mockImplementation(mockActionGetMyProfile as any);
  //   const user = {
  //     signInUserSession: {
  //       idToken: { payload: { 'custom:user_uuid': USER_PROFILE.id } },
  //     },
  //   };
  //   storeData.menu.myProfile = USER_PROFILE;
  //   storeData.auth.user = user as any;

  //   const store = mockStore(storeData);
  //   const props = { route: { params: { userId: USER_PROFILE.id } } };
  //   const wrapper = renderWithRedux(<UserProfile {...props} />, store);

  //   const buttonEditUserProfile = wrapper.getByTestId('user_profile.edit');
  //   expect(buttonEditUserProfile).toBeDefined();

  //   fireEvent.press(buttonEditUserProfile);

  //   expect(navigate).toHaveBeenCalledWith(mainStack.userEdit, {
  //     userId: USER_PROFILE.id,
  //   });
  // });

  // it('should redirect to app chat when click Direct Message button', async () => {
  //   const spy = jest.spyOn(linkUtil, 'openUrl');

  //   const mockActionGetUserProfile = () => ({
  //     type: menuTypes.SET_USER_PROFILE,
  //     payload: { ...USER_PROFILE, id: 1 },
  //   });

  //   jest
  //     .spyOn(menuActions, 'getUserProfile')
  //     .mockImplementation(mockActionGetUserProfile as any);
  //   const user = {
  //     signInUserSession: {
  //       idToken: { payload: { 'custom:user_uuid': USER_PROFILE.id } },
  //     },
  //   };
  //   storeData.menu.myProfile = USER_PROFILE;
  //   storeData.auth.user = user as any;
  //   storeData.groups.joinedCommunities.data = [{ slug: 'test' }];

  //   const store = mockStore(storeData);
  //   const props = { route: { params: { userId: 1 } } };
  //   const wrapper = renderWithRedux(<UserProfile {...props} />, store);

  //   const buttonDirectMessage = wrapper.getByTestId('header.icon_chat');
  //   expect(buttonDirectMessage).toBeDefined();

  //   fireEvent.press(buttonDirectMessage);
  //   expect(spy).toBeCalled();
  // });

  // it('should render loading when loadingUserProfile is true', () => {
  //   storeData.menu.loadingUserProfile = true;
  //   const user = {
  //     signInUserSession: {
  //       idToken: { payload: { 'custom:user_uuid': USER_PROFILE.id } },
  //     },
  //   };
  //   storeData.auth.user = user as any;

  //   const store = mockStore(storeData);
  //   const props = { route: { params: { userId: 1 } } };
  //   const wrapper = renderWithRedux(<UserProfile {...props} />, store);

  //   const loadingView = wrapper.getByTestId('user_profile.loading');
  //   expect(loadingView).toBeDefined();
  // });

  // it('should render NoUserFound if can\'t get user profile', () => {
  //   storeData.menu.showUserNotFound = true;
  //   const store = mockStore(storeData);
  //   const props = { route: { params: { userId: 1 } } };
  //   const wrapper = renderWithRedux(<UserProfile {...props} />, store);

  //   const userNotFound = wrapper.getByTestId('user_profile.not_found');
  //   expect(userNotFound).toBeDefined();
  // });
});
