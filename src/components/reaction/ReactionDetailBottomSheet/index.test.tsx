/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import { cleanup, waitFor } from '@testing-library/react-native';

import { fireEvent, renderWithRedux, configureStore } from '../../../test/testUtils';
import ReactionDetailBottomSheet from './index';
import initialState from '../../../store/initialState';

afterEach(cleanup);

describe('ReactionDetailBottomSheet component', () => {
  const mockStore = configureStore([]);

  const listUserReact = [
    {
      avatar:
        'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/75f92c17-843b-49de-8445-93531854fd65.jpeg',
      fullname: 'Hoàng Minh Trọng',
      id: '53',
    },
    {
      avatar:
        'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
      fullname: 'Nguyễn Thị Ngọc Linh',
      id: '33',
    },
    {
      avatar:
        'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/363963d1-e89a-4899-855e-44b1f66401dc.jpg',
      fullname: 'Nguyen Thi Thu Queen',
      id: '58',
    },
  ];
  const getDataPromise = jest
    .fn()
    .mockImplementation((): Promise<any> => Promise.resolve(listUserReact));

  const fake_data = {
    getDataParam: {
      commentId: undefined,
      postId: 'efe9c800-92be-11ec-8080-800124087730',
    },
    getDataPromise,
    initReaction: 'grinning_face_with_star_eyes',
    isOpen: true,
    reactionCounts: {
      comment: 9,
      comment_count: 11,
      grinning_face_with_star_eyes: 2,
      kissing_closed_eyes: 2,
      kissing_smiling_eyes: 2,
      sweat_smile: 3,
    },
  };
  it('renders correctly', async () => {
    const storeData = { ...initialState };

    // @ts-ignore
    storeData.modal.reactionDetailBottomSheet = fake_data;
    const store = mockStore(storeData);
    const rendered = await waitFor(() => renderWithRedux(<ReactionDetailBottomSheet />, store));
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should render list user react correspondingly when clicking reaction item on ReactionTabBar', async () => {
    const storeData = { ...initialState };

    // @ts-ignore
    storeData.modal.reactionDetailBottomSheet = fake_data;
    const store = mockStore(storeData);

    const rendered = await waitFor(() => renderWithRedux(<ReactionDetailBottomSheet />, store));

    const btnComponent = rendered.getByTestId(
      'reaction_detail_bottomSheet.kissing_closed_eyes',
    );
    expect(btnComponent).toBeDefined();
    fireEvent.press(btnComponent);

    const activeStatusComponent = rendered.getByTestId(
      'reaction_detail_bottomSheet.active_kissing_closed_eyes',
    );
    expect(activeStatusComponent).toBeDefined();

    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should render list empty user react if call api failed', async () => {
    const getDataPromiseFail = jest
      .fn()
      .mockImplementation((): Promise<any> => Promise.reject());

    const storeData = { ...initialState };

    storeData.modal.reactionDetailBottomSheet = {
      ...fake_data,
      // @ts-ignore
      getDataPromise: getDataPromiseFail,
      isOpen: false,
    };
    const store = mockStore(storeData);

    const rendered = await waitFor(() => renderWithRedux(<ReactionDetailBottomSheet />, store));
    const listUserComponent = rendered.getByTestId(
      'reaction_detail_bottomSheet.list_user',
    );

    expect(listUserComponent.props?.data?.length).toEqual(0);
  });

  it('should call navigate to user profile by id when click item', async () => {
    const storeData = { ...initialState };

    // @ts-ignore
    storeData.modal.reactionDetailBottomSheet = fake_data;
    const store = mockStore(storeData);

    const rendered = await waitFor(() => renderWithRedux(<ReactionDetailBottomSheet />, store));

    const itemComponent = rendered.getByTestId(
      'reaction_detail_bottomSheet.Hoàng Minh Trọng',
    );
    expect(itemComponent).toBeDefined();
    fireEvent.press(itemComponent);

    // will update when find solution with navigation.navigate func
  });

  it('should call navigate to user profile by username when click item', async () => {
    const storeData = { ...initialState };
    const _getDataPromise = jest.fn().mockImplementation(
      (): Promise<any> => Promise.resolve([
        {
          avatar:
              'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/75f92c17-843b-49de-8445-93531854fd65.jpeg',
          fullname: 'Hoàng Minh Trọng',
          username: 'tronghoang',
          id: '',
        },
      ]),
    );

    // @ts-ignore
    storeData.modal.reactionDetailBottomSheet = {
      ...fake_data,
      // @ts-ignore
      getDataPromise: _getDataPromise,
    };
    const store = mockStore(storeData);

    const rendered = await waitFor(() => renderWithRedux(<ReactionDetailBottomSheet />, store));

    const itemComponent = rendered.getByTestId(
      'reaction_detail_bottomSheet.Hoàng Minh Trọng',
    );
    expect(itemComponent).toBeDefined();
    fireEvent.press(itemComponent);

    // will update when find solution with navigation.navigate func
  });

  it('should render list empty user react if call api return null', async () => {
    const getDataPromiseFail = jest
      .fn()
      .mockImplementation((): Promise<any> => Promise.resolve(null));

    const storeData = { ...initialState };

    // @ts-ignore
    storeData.modal.reactionDetailBottomSheet = {
      ...fake_data,
      // @ts-ignore
      getDataPromise: getDataPromiseFail,
      isOpen: false,
    };
    const store = mockStore(storeData);

    const rendered = await waitFor(() => renderWithRedux(<ReactionDetailBottomSheet />, store));
    const listUserComponent = rendered.getByTestId(
      'reaction_detail_bottomSheet.list_user',
    );

    expect(listUserComponent.props?.data?.length).toEqual(0);
  });
});
