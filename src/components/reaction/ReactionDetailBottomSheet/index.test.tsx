/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import useModalStore from '~/store/modal';

import {
  cleanup, render, act, fireEvent,
} from '../../../test/testUtils';
import ReactionDetailBottomSheet from './index';
import { MockedAppContext } from '~/test/MockedAppContext';
import streamApi from '~/api/StreamApi';
import useReactionDetailStore from './store';
import * as navigationHook from '~/hooks/navigation';
import mainStack from '~/router/navigator/MainStack/stack';
import { listUserReact, reactionsCount, mockListUser } from '~/test/mock_data/reactions';

afterEach(cleanup);

describe('ReactionDetailBottomSheet component', () => {
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
    reactionsCount,
  };

  it('should render list user react correspondingly when clicking reaction item on ReactionTabBar', () => {
    const response = {
      list: mockListUser,
    };

    const spy = jest.spyOn(streamApi, 'getReactionDetail').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    useModalStore.setState((state) => {
      state.reactionDetailBottomSheet = {
        initReaction: 'grinning_face_with_star_eyes',
        isOpen: true,
        reactionsCount: fake_data.reactionsCount,
      };
      return state;
    });

    const values = { useModalStore, useReactionDetailStore };
    const rendered = render(
      <MockedAppContext.Provider value={values}>
        <ReactionDetailBottomSheet />
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

    const userItemComps = [];
    listUserReact.forEach((item) => {
      const itemComponent = rendered.getByTestId(
        `reaction_detail_bottomSheet.${item.fullname}`,
      );
      expect(itemComponent).toBeDefined();
      userItemComps.push(itemComponent);
    });

    fireEvent.press(userItemComps[0]);
    expect(navigate).toHaveBeenCalledWith(mainStack.userProfile, { userId: listUserReact[0].id });
  });

  it('should render list empty user react if call api return null', () => {
    const values = { useModalStore, useReactionDetailStore };
    const rendered = render(
      <MockedAppContext.Provider value={values}>
        <ReactionDetailBottomSheet />
      </MockedAppContext.Provider>,
    );
    const listUserComponent = rendered.getByTestId(
      'reaction_detail_bottomSheet.list_user',
    );

    expect(listUserComponent.props?.data?.length).toEqual(0);
  });
});
