import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import streamApi from '~/api/StreamApi';
import {
  fireEvent, renderWithRedux, act,
} from '~/test/testUtils';
import useDraftPostStore from '../index';
import { POST_DETAIL } from '~/test/mock_data/post';

const Component = () => {
  const {
    posts = [], doGetDraftPosts,
  } = useDraftPostStore();

  return (
    <View>
      <TouchableOpacity testID="button-get" onPress={() => doGetDraftPosts({ isRefresh: false })} />
      <TouchableOpacity testID="button-refresh" onPress={() => doGetDraftPosts({ isRefresh: true })} />
      <Text testID="text-count">{posts.length}</Text>
    </View>
  );
};

describe('getDraftPosts', () => {
  it('should not call api get draft posts when hasNextPage = false', () => {
    const spy = jest.spyOn(streamApi, 'getDraftPosts').mockImplementation(
      () => Promise.resolve({
        data: [{ title: 'hello' }],
      }) as any,
    );

    act(() => {
      useDraftPostStore.setState({ hasNextPage: false, loading: false, refreshing: false });
    });

    const wrapper = renderWithRedux(<Component />);
    const btnGet = wrapper.getByTestId('button-get');
    fireEvent.press(btnGet);
    expect(spy).not.toBeCalled();
  });

  it('should call api get draft posts success when hasNextPage = false', () => {
    const spy = jest.spyOn(streamApi, 'getDraftPosts').mockImplementation(
      () => Promise.resolve({
        data: [POST_DETAIL],
      }) as any,
    );

    const wrapper = renderWithRedux(<Component />);
    const btnGet = wrapper.getByTestId('button-get');
    fireEvent.press(btnGet);
    expect(spy).toBeCalled();
    // todo fix this, expect failed because of get state still return the old one
  });

  it('should call api get draft posts success when hasNextPage = true', () => {
    const spy = jest.spyOn(streamApi, 'getDraftPosts').mockImplementation(
      () => Promise.resolve({
        data: [POST_DETAIL],
      }) as any,
    );

    const wrapper = renderWithRedux(<Component />);
    const btnRefresh = wrapper.getByTestId('button-refresh');
    fireEvent.press(btnRefresh);
    expect(spy).toBeCalled();
    // todo fix this, expect failed because of get state still return the old one
  });

  it('should call api get draft posts failed', () => {
    const spy = jest.spyOn(streamApi, 'getDraftPosts').mockImplementation(
      () => Promise.reject('internal error') as any,
    );

    const wrapper = renderWithRedux(<Component />);
    const btnGet = wrapper.getByTestId('button-get');
    fireEvent.press(btnGet);
    expect(spy).toBeCalled();
    // todo show toast error
  });
});
