import * as React from 'react';
import {render, cleanup, waitFor} from '@testing-library/react-native';
import UsersSeenPostBottomSheet from './UsersSeenPostBottomSheet';
import {fireEvent, renderWithRedux, configureStore} from '~/test/testUtils';
import initialState from '~/store/initialState';

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

  const mockStore = configureStore([]);
  it(`renders correctly users seen bottom sheet view`, async () => {
    const storeData = {...initialState};
    const store = mockStore(storeData);

    const rendered = await waitFor(() =>
      renderWithRedux(<UsersSeenPostBottomSheet postId={'7'} />, store),
    );
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should render list users seen post', async () => {
    const storeData = {...initialState};
    // @ts-ignore
    storeData.post.seenPostList = fake_data;
    const store = mockStore(storeData);
    const rendered = await waitFor(() =>
      renderWithRedux(<UsersSeenPostBottomSheet postId={'7'} />, store),
    );
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it(`should call navigate to user profile by id when click item`, async () => {
    const storeData = {...initialState};
    // @ts-ignore
    storeData.post.seenPostList = fake_data;
    const store = mockStore(storeData);
    const rendered = await waitFor(() =>
      renderWithRedux(<UsersSeenPostBottomSheet postId={'7'} />, store),
    );
    const itemComponent = rendered.getByTestId(
      'seen_post_bottomSheet.Hoàng Nhật',
    );
    expect(itemComponent).toBeDefined();
    fireEvent.press(itemComponent);
  });

  it(`should call navigate to user profile by username when click item`, async () => {
    const storeData = {...initialState};
    // @ts-ignore
    const store = mockStore(storeData);
    const rendered = await waitFor(() =>
      renderWithRedux(<UsersSeenPostBottomSheet postId={'7'} />, store),
    );
    const itemComponent = rendered.getByTestId(
      'seen_post_bottomSheet.Nguyễn Anh Thiện',
    );
    expect(itemComponent).toBeDefined();
    fireEvent.press(itemComponent);
  });
});
