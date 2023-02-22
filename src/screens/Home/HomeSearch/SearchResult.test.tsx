import React from 'react';
import { renderWithRedux, act } from '../../../test/testUtils';
import SearchResult from './SearchResult';
import useFeedSearchStore from './store';
import streamApi from '~/api/StreamApi';
import { responseSearchPost } from '~/test/mock_data/home';

describe('SearchResult component', () => {
  it('should render empty search result', () => {
    const responseEmpty = { ...responseSearchPost };
    responseEmpty.list = [];
    responseEmpty.meta.total = 0;

    const spyApiGetSearchPost = jest
      .spyOn(streamApi, 'getSearchPost')
      .mockImplementation(() => Promise.resolve(responseSearchPost) as any);
    act(() => {
      useFeedSearchStore.getState().actions.setNewsfeedSearch({ searchText: 'abc' });
    });
    jest.useFakeTimers();

    const rendered = renderWithRedux(<SearchResult />);

    act(() => {
      jest.runAllTimers();
    });

    expect(spyApiGetSearchPost).toBeCalled();
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should render list search result', () => {
    const spyApiGetSearchPost = jest
      .spyOn(streamApi, 'getSearchPost')
      .mockImplementation(() => Promise.resolve(responseSearchPost) as any);
    act(() => {
      useFeedSearchStore.getState().actions.setNewsfeedSearch({ searchText: 'abc' });
    });
    jest.useFakeTimers();

    const rendered = renderWithRedux(<SearchResult />);

    act(() => {
      jest.runAllTimers();
    });

    expect(spyApiGetSearchPost).toBeCalled();
    expect(rendered.toJSON()).toMatchSnapshot();
  });
});
