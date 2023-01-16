import { act, renderHook } from '@testing-library/react-hooks';
import * as React from 'react';
import streamApi from '~/api/StreamApi';
import useModalStore from '~/store/modal';
import { listArticle, mockSeries, searchSeriesRequestParams } from '~/test/mock_data/series';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import AddArticles from '.';
import useAddArticlesStore, { IAddArticlesState } from './store';

describe('AddArticles component', () => {
  const seriesId = '5264f1b3-c8b8-428a-9fb8-7f075f03d0c8';
  const articles = listArticle;
  const { audience } = mockSeries;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const response = {
      code: 200,
      data: {
        list: listArticle,
        meta: {
          total: listArticle.length,
          offset: 0,
        },
      },
      meta: {},
    };

    const spyApiSearchArticles = jest.spyOn(streamApi, 'searchArticleInSeries').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useAddArticlesStore());

    act(() => {
      result.current.actions.searchArticles({ ...searchSeriesRequestParams, contentSearch: '' });
    });

    const onCloseSearch = jest.fn();

    const wrapper = renderWithRedux(<AddArticles
      seriesId={seriesId}
      audience={audience}
      articles={articles}
      isOpen
      onClose={onCloseSearch}
      placeholder="placeholder"
    />);

    act(() => {
      jest.runAllTimers();
    });

    expect(spyApiSearchArticles).toBeCalled();
    expect(wrapper.toJSON()).toMatchSnapshot();
  });

  it('renders correctly with empty data', () => {
    const response = {
      code: 200,
      data: {
        list: [],
        meta: {
          total: 0,
          offset: 0,
        },
      },
      meta: {},
    };

    const spyApiSearchArticles = jest.spyOn(streamApi, 'searchArticleInSeries').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useAddArticlesStore());

    act(() => {
      result.current.actions.searchArticles({ ...searchSeriesRequestParams, contentSearch: '' });
    });

    const onCloseSearch = jest.fn();

    const wrapper = renderWithRedux(<AddArticles
      seriesId={seriesId}
      audience={audience}
      articles={articles}
      isOpen
      onClose={onCloseSearch}
      placeholder="placeholder"
    />);

    act(() => {
      jest.runAllTimers();
    });

    const emptyScreen = wrapper.queryByTestId('empty_screen');
    expect(emptyScreen).toBeDefined();
    expect(spyApiSearchArticles).toBeCalled();
    expect(wrapper.toJSON()).toMatchSnapshot();
  });
  it('search success', () => {
    const response = {
      code: 200,
      data: {
        list: listArticle,
        meta: {
          total: listArticle.length,
          offset: 0,
        },
      },
      meta: {},
    };

    const spyApiSearchArticles = jest.spyOn(streamApi, 'searchArticleInSeries').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useAddArticlesStore());

    act(() => {
      result.current.actions.searchArticles({ ...searchSeriesRequestParams, contentSearch: '' });
    });

    const onCloseSearch = jest.fn();

    const wrapper = renderWithRedux(<AddArticles
      seriesId={seriesId}
      audience={audience}
      articles={articles}
      isOpen
      onClose={onCloseSearch}
      placeholder="placeholder"
    />);

    act(() => {
      jest.runAllTimers();
    });

    expect(spyApiSearchArticles).toBeCalled();
    const searchComponent = wrapper.queryByTestId('search_input.input');
    expect(searchComponent).toBeDefined();

    act(() => {
      fireEvent.changeText(searchComponent, 'test');
    });
    act(() => {
      jest.runAllTimers();
    });

    const expectGroupIds = [
      audience.groups[0].id,
      audience.groups[1].id,
    ];

    expect(spyApiSearchArticles).toHaveBeenLastCalledWith({
      contentSearch: 'test', groupIds: expectGroupIds, limit: 20, offset: 0,
    });
  });

  it('should call api add article when click add', () => {
    const response = {
      code: 200,
      meta: {
        message: 'OK',
      },
    };

    const spyApiAddArticles = jest.spyOn(streamApi, 'addArticleInSeries').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    useAddArticlesStore.setState((state: IAddArticlesState) => {
      state.items = listArticle as any;
      state.hasNextPage = false;
      return state;
    });

    jest.useFakeTimers();
    const { result } = renderHook(() => useAddArticlesStore());

    const onCloseSearch = jest.fn();

    const wrapper = renderWithRedux(<AddArticles
      seriesId={seriesId}
      audience={audience}
      articles={[]}
      isOpen
      onClose={onCloseSearch}
      placeholder="placeholder"
    />);

    const items = wrapper.queryAllByTestId('article.icon.button');
    expect(items).toBeDefined();

    fireEvent.press(items[0]);
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.loading).toBe(false);
    expect(spyApiAddArticles).toHaveBeenLastCalledWith(seriesId, { articleIds: [listArticle[0].id] });
    expect(showToast).toHaveBeenCalled();
  });
  it('should do nothing when click add but item is added: ', () => {
    const response = {
      code: 200,
      meta: {
        message: 'OK',
      },
    };

    const spyApiAddArticles = jest.spyOn(streamApi, 'addArticleInSeries').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    useAddArticlesStore.setState((state: IAddArticlesState) => {
      state.items = listArticle as any;
      state.hasNextPage = false;
      return state;
    });

    jest.useFakeTimers();
    const { result } = renderHook(() => useAddArticlesStore());

    const onCloseSearch = jest.fn();

    const wrapper = renderWithRedux(<AddArticles
      seriesId={seriesId}
      audience={audience}
      articles={articles}
      isOpen
      onClose={onCloseSearch}
      placeholder="placeholder"
    />);

    const items = wrapper.queryAllByTestId('article.icon.button');
    expect(items).toBeDefined();

    fireEvent.press(items[0]);
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.loading).toBe(false);
    expect(spyApiAddArticles).not.toBeCalled();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });
});
