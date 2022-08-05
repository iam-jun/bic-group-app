import * as React from 'react';
import { cleanup, waitFor } from '@testing-library/react-native';
import UsersSeenPostBottomSheet from './UsersSeenPostBottomSheet';
import { fireEvent, renderWithRedux, configureStore } from '~/test/testUtils';
import initialState from '~/store/initialState';
import * as navigationHook from '~/hooks/navigation';

afterEach(cleanup);

describe('UsersSeenPostBottomSheet component', () => {
  const fake_data = {
    data: [
      {
        fullname: 'Hoàng Nhật',
        id: 43,
        username: 'hoangnhat',
        email: 'hoangnhat@tgm.vn',
        avatar:
          'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/19c296be-b4d7-4343-aa18-e0024503ca48.jpg',
        groups: [4, 5, 6],
      },
      {
        fullname: 'Nguyễn Anh Thiện',
        id: null,
        username: 'anhthien',
        email: 'anhthien@tgm.vn',
        avatar:
          'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/78442999-8f69-403e-afc7-d1a9e4083f7d.jpg',
        groups: [1, 2, 3],
      },
    ],
    total: 2,
    canLoadMore: true,
  };

  const createTestStore = configureStore([]);
  it('renders correctly loading data users seen post bottom sheet view', async () => {
    const storeData = { ...initialState };
    const store = createTestStore(storeData);

    const rendered = await waitFor(() => renderWithRedux(<UsersSeenPostBottomSheet postId="7" />, store));
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should render list users seen post', async () => {
    const storeData = { ...initialState };
    // @ts-ignore
    storeData.post.seenPostList = fake_data;
    const store = createTestStore(storeData);
    const rendered = await waitFor(() => renderWithRedux(<UsersSeenPostBottomSheet postId="7" />, store));
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should call navigate to user profile by id when click item', async () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));
    const storeData = { ...initialState };
    // @ts-ignore
    storeData.post.seenPostList = fake_data;
    const store = createTestStore(storeData);
    const rendered = await waitFor(() => renderWithRedux(<UsersSeenPostBottomSheet postId="7" />, store));
    const itemComponent = rendered.getByTestId(
      'users_seen_post_bottom_sheet.item_username.hoangnhat',
    );
    expect(itemComponent).toBeDefined();
    fireEvent.press(itemComponent);

    expect(navigate).toBeCalledWith('user-profile', {
      userId: 43,
    });
  });

  it('should call navigate to user profile by username when click item', async () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));
    const storeData = { ...initialState };
    // @ts-ignore
    const store = createTestStore(storeData);
    const rendered = await waitFor(() => renderWithRedux(<UsersSeenPostBottomSheet postId="7" />, store));
    const itemComponent = rendered.getByTestId(
      'users_seen_post_bottom_sheet.item_username.anhthien',
    );
    expect(itemComponent).toBeDefined();
    fireEvent.press(itemComponent);
    expect(navigate).toBeCalledWith('user-profile', {
      params: { type: 'username' },
      userId: 'anhthien',
    });
  });
});
