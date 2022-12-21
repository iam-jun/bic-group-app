import { act, renderHook } from '@testing-library/react-hooks';
import * as React from 'react';
import usePostsStore from '~/store/entities/posts';
import { renderWithRedux } from '~/test/testUtils';
import TagDetail from '.';
import { mockArticle } from '~/test/mock_data/article';
import streamApi from '~/api/StreamApi';

describe('TagDetail component', () => {
  const mockTagData = { id: '5264f1b3-c8b8-428a-9fb8-7f075f03d0c8', name: 'test' };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = renderWithRedux(<TagDetail route={{ params: { tagData: mockTagData } }} />);
    expect(wrapper.toJSON()).toMatchSnapshot();
  });
  it('renders list article success', () => {
    const response = {
      code: 200,
      list: [mockArticle],
      data: {
        meta: {
          total: 1,
        },
      },
      meta: {},
    };
    const spy = jest.spyOn(streamApi, 'getSearchPost').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const { result } = renderHook(() => usePostsStore());

    act(() => {
      result.current.actions.addToPosts({ data: [mockArticle] as any });
    });

    const wrapper = renderWithRedux(<TagDetail route={{ params: { tagData: mockTagData } }} />);
    expect(wrapper.toJSON()).toMatchSnapshot();

    expect(spy).toBeCalled();
    const articlesComponent = wrapper.queryByTestId('tag_detail.content');
    expect(articlesComponent).toBeDefined();
  });
});
