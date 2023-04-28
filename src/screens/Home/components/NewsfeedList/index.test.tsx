import React from 'react';

import { act } from 'react-test-renderer';
import { Text } from 'react-native';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import NewsfeedList, { NewsfeedListHeader } from './index';
import { ContentFeed } from '~/interfaces/IFeed';
import MockedNavigator from '~/test/MockedNavigator';
import { timeOut } from '~/utils/common';
import * as navigationHook from '~/hooks/navigation';

describe('NewsfeedList component', () => {
  const baseProps = {
    data: ['test', 'test'],
    refreshing: false,
    canLoadMore: true,
    HeaderComponent: undefined,
    contentFilter: ContentFeed.ALL,

    onEndReach: jest.fn(),
    onRefresh: jest.fn(),
    onScrollY: jest.fn(),
  };
  it('renders correctly', async () => {
    const log = jest.spyOn(console, 'log').mockImplementation(() => undefined);
    const setTimeout = jest.spyOn(global, 'setTimeout');
    const wrapper = renderWithRedux(<MockedNavigator component={() => <NewsfeedList {...baseProps} />} />);
    const { getByTestId } = wrapper;

    await timeOut(200);
    const containerComponent = getByTestId('newsfeed_list');
    expect(containerComponent).toBeDefined();

    const scrollView = getByTestId('newsfeed_list.list');

    const {
      refreshControl, onScroll, onLoad, onEndReached,
    } = scrollView.props;

    await act(async () => {
      refreshControl.props.onRefresh();
      onScroll({ nativeEvent: { contentOffset: { y: 100 } } });
      onLoad();
      onEndReached();
    });

    expect(baseProps.onRefresh).toBeCalled();
    expect(baseProps.onScrollY).toBeCalled();
    expect(log).toBeCalled();
    await timeOut(1000);
    expect(setTimeout).toBeCalled();
  });

  it('renders ListEmptyComponent canLoadMore = true', async () => {
    const propsClone = { ...baseProps, data: [] };
    const wrapper = renderWithRedux(<MockedNavigator component={() => <NewsfeedList {...propsClone} />} />);

    const emptyView = wrapper.queryByTestId('newsfeed_list.empty');
    expect(emptyView).toBeNull();

    const scrollView = wrapper.getByTestId('newsfeed_list.empty_list');
    const { refreshControl } = scrollView.props;
    await act(async () => {
      refreshControl.props.onRefresh();
      expect(baseProps.onRefresh).toBeCalled();
    });
  });

  it('renders ListEmptyComponent canLoadMore = false', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));
    const propsClone = { ...baseProps, data: [], canLoadMore: false };
    const wrapper = renderWithRedux(<MockedNavigator component={() => <NewsfeedList {...propsClone} />} />);

    const emptyView = wrapper.queryByTestId('newsfeed_list.empty');
    expect(emptyView).not.toBeNull();

    const btnDiscover = wrapper.queryByTestId('newsfeed_list.btn_discover');
    fireEvent.press(btnDiscover);
    expect(navigate).toBeCalled();
  });

  it('renders NewsfeedListHeader canLoadMore = false', () => {
    const props = { HeaderComponent: <Text>Test</Text>, attributeFilter: ContentFeed.ALL };
    const wrapper = renderWithRedux(<MockedNavigator component={() => <NewsfeedListHeader {...props} />} />);

    const containerComponent = wrapper.queryByTestId('newsfeed_list_header');
    expect(containerComponent).not.toBeNull();
  });
});
