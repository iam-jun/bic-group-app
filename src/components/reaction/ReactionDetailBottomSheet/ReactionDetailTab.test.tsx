/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import useModalStore from '~/store/modal';

import {
  fireEvent, cleanup, render, act,
} from '../../../test/testUtils';
import { MockedAppContext } from '~/test/MockedAppContext';
import streamApi from '~/api/StreamApi';
import useReactionDetailStore from './store';
import ReactionDetailTab from './ReactionDetailTab';
import { listUserReact, mockListUser, reactionsCount } from '~/test/mock_data/reactions';

afterEach(cleanup);

describe('ReactionDetailTab component', () => {
  it('should render list user react correspondingly when clicking reaction item on ReactionTabBar', () => {
    const response = {
      list: mockListUser,
    };
    const initReaction = 'grinning_face_with_star_eyes';

    const spy = jest.spyOn(streamApi, 'getReactionDetail').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const onPressItem = jest.fn();
    const getDataParam = {
      commentId: undefined,
      postId: 'efe9c800-92be-11ec-8080-800124087730',
    };

    useModalStore.setState((state) => {
      state.reactionDetailBottomSheet = {
        initReaction,
        isOpen: true,
        reactionsCount,
      };
      return state;
    });

    const values = { useModalStore, useReactionDetailStore };

    const rendered = render(
      <MockedAppContext.Provider value={values}>
        <ReactionDetailTab
          reactionType={initReaction}
          getDataParam={getDataParam}
          onPressItem={onPressItem}
        />
      </MockedAppContext.Provider>,
    );

    expect(spy).toBeCalled();

    act(() => {
      useReactionDetailStore.setState((state) => {
        state.data = listUserReact;
        state.loading = false;
        state.canLoadMore = false;
        return state;
      });
    });

    const itemTestID = 'reaction_detail_bottomSheet';
    expect(rendered.toJSON()).toMatchSnapshot();
    const items = [];
    listUserReact.forEach((item) => {
      const primaryItem = rendered.getByTestId(`${itemTestID}.${item.fullname}`);
      expect(items).toBeDefined();
      if (!!primaryItem) {
        items.push(primaryItem);
      }
    });
    expect(items.length).toEqual(listUserReact.length);
    fireEvent.press(items[2]);
    expect(onPressItem).toBeCalled();
  });

  // it('should render list empty user react if call api failed', () => {
  //   const getDataPromiseFail = jest
  //     .fn()
  //     .mockImplementation((): Promise<any> => Promise.reject());

  //   useModalStore.setState((state) => {
  //     state.reactionDetailBottomSheet = {
  //       ...fake_data,
  //       // @ts-ignore
  //       getDataPromise: getDataPromiseFail,
  //       isOpen: false,
  //     };
  //     return state;
  //   });

  //   const rendered = renderWithRedux(<ReactionDetailBottomSheet />);
  //   const listUserComponent = rendered.getByTestId(
  //     'reaction_detail_bottomSheet.list_user',
  //   );

  //   expect(listUserComponent.props?.data?.length).toEqual(0);
  // });

  // it('should call navigate to user profile by id when click item', async () => {
  //   const rendered = renderWithRedux(<ReactionDetailBottomSheet />);

  //   const itemComponent = rendered.getByTestId(
  //     'reaction_detail_bottomSheet.Hoàng Minh Trọng',
  //   );
  //   expect(itemComponent).toBeDefined();
  //   fireEvent.press(itemComponent);

  //   // will update when find solution with navigation.navigate func
  // });

  // it('should call navigate to user profile by username when click item', () => {
  //   const _getDataPromise = jest.fn().mockImplementation(
  //     (): Promise<any> => Promise.resolve([
  //       {
  //         avatar:
  //             'https://bein-entity-attribute-sandbox.s3.
  // ap-southeast-1.amazonaws.com/user/avatar/images/original/75f92c17-843b-49de-8445-93531854fd65.jpeg',
  //         fullname: 'Hoàng Minh Trọng',
  //         username: 'tronghoang',
  //         id: '',
  //       },
  //     ]),
  //   );

  //   const rendered = renderWithRedux(<ReactionDetailBottomSheet />);

  //   const itemComponent = rendered.getByTestId(
  //     'reaction_detail_bottomSheet.Hoàng Minh Trọng',
  //   );
  //   expect(itemComponent).toBeDefined();
  //   fireEvent.press(itemComponent);

  //   // will update when find solution with navigation.navigate func
  // });

  // it('should render list empty user react if call api return null', () => {
  //   const getDataPromiseFail = jest
  //     .fn()
  //     .mockImplementation((): Promise<any> => Promise.resolve(null));

  //   const rendered = renderWithRedux(<ReactionDetailBottomSheet />);
  //   const listUserComponent = rendered.getByTestId(
  //     'reaction_detail_bottomSheet.list_user',
  //   );

  //   expect(listUserComponent.props?.data?.length).toEqual(0);
  // });
});
