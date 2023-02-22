import i18next from 'i18next';
import React from 'react';
import { PostType } from '~/interfaces/IPost';
import { userSearchResult } from '~/test/mock_data/home';
import {
  act, fireEvent, renderHook, renderWithRedux,
} from '~/test/testUtils';
import CommonModal from '../CommonModal';
import { TypeFilter } from './constants';
import { endOfTime, startOfTime } from './helper';
import FilterToolbar from './index';
import useFilterToolbarStore from './store';

describe('FilterToolbar component', () => {
  it('should render correctly', () => {
    const rendered = renderWithRedux(<FilterToolbar />);
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should set groupId', () => {
    renderWithRedux(<FilterToolbar groupId="123" />);

    const { result } = renderHook(() => useFilterToolbarStore((state) => state));

    expect(result.current.search.groupId).toEqual('123');
  });

  it('should render selected filter date correctly', () => {
    let btnFilterDate;
    const rendered = renderWithRedux(<FilterToolbar />);
    const { result } = renderHook(() => useFilterToolbarStore((state) => state));

    act(() => {
      result.current.actions.setFilterDatePosted({
        startDate: startOfTime(TypeFilter.Today).toISOString(),
        endDate: endOfTime(TypeFilter.Today).toISOString(),
      });
    });

    btnFilterDate = rendered.getByText(i18next.t('home:newsfeed_search:today'));
    expect(btnFilterDate).toBeDefined();

    act(() => {
      result.current.actions.setFilterDatePosted({
        startDate: startOfTime(TypeFilter.Yesterday).toISOString(),
        endDate: endOfTime(TypeFilter.Yesterday).toISOString(),
      });
    });

    btnFilterDate = rendered.getByText(
      i18next.t('home:newsfeed_search:yesterday'),
    );
    expect(btnFilterDate).toBeDefined();

    act(() => {
      result.current.actions.setFilterDatePosted({
        startDate: startOfTime(TypeFilter.LastSevenDays).toISOString(),
        endDate: endOfTime(TypeFilter.LastSevenDays).toISOString(),
      });
    });

    btnFilterDate = rendered.getByText(
      i18next.t('home:newsfeed_search:last_seven_days'),
    );
    expect(btnFilterDate).toBeDefined();

    act(() => {
      result.current.actions.setFilterDatePosted({
        startDate: '2023-02-08T17:00:00.000Z',
        endDate: '2023-02-13T16:59:59.999Z',
      });
    });

    btnFilterDate = rendered.getByText('Feb 09, 2023 - Feb 13, 2023');
    expect(btnFilterDate).toBeDefined();
  });

  it('should render selected filter post type correctly', () => {
    let btnFilterPostType;
    const rendered = renderWithRedux(<FilterToolbar />);
    const { result } = renderHook(() => useFilterToolbarStore((state) => state));

    act(() => {
      result.current.actions.setFilterPostType(PostType.POST);
    });

    btnFilterPostType = rendered.getByText(
      i18next.t('home:newsfeed_search:filter_post'),
    );
    expect(btnFilterPostType).toBeDefined();

    act(() => {
      result.current.actions.setFilterPostType(PostType.ARTICLE);
    });

    btnFilterPostType = rendered.getByText(
      i18next.t('home:newsfeed_search:filter_article'),
    );
    expect(btnFilterPostType).toBeDefined();

    act(() => {
      result.current.actions.setFilterPostType(PostType.SERIES);
    });

    btnFilterPostType = rendered.getByText(
      i18next.t('home:newsfeed_search:filter_series'),
    );
    expect(btnFilterPostType).toBeDefined();
  });

  it('should open modal filter by post type when press on button filter by post type', () => {
    const rendered = renderWithRedux(
      <>
        <FilterToolbar />
        <CommonModal />
      </>,
    );

    const btnFilterPostType = rendered.getByTestId(
      'filter_tool_bar.btn_filter_post_type-selected',
    );

    act(() => {
      fireEvent.press(btnFilterPostType);
    });

    const filterPostTypeContainer = rendered.getByTestId('filter_post_type');

    expect(filterPostTypeContainer).toBeDefined();
  });

  it('should open modal filter by created by when press on button filter by created by', () => {
    const rendered = renderWithRedux(
      <>
        <FilterToolbar />
        <CommonModal />
      </>,
    );

    const btnFilterCreatedBy = rendered.getByTestId(
      'filter_tool_bar.filter_created_by-selected',
    );

    act(() => {
      fireEvent.press(btnFilterCreatedBy);
    });

    const filterCreatedByContainer = rendered.getByTestId('filter_created_by');

    expect(filterCreatedByContainer).toBeDefined();
  });

  it('should open modal filter by date when press on button filter by date', () => {
    const rendered = renderWithRedux(
      <>
        <FilterToolbar />
        <CommonModal />
      </>,
    );

    const btnFilterByDate = rendered.getByTestId(
      'filter_tool_bar.filter_date_option-selected',
    );

    act(() => {
      fireEvent.press(btnFilterByDate);
    });

    const filterDateContainer = rendered.getByTestId('filter_date_modal');

    expect(filterDateContainer).toBeDefined();
  });

  it('should call onSelectCreatedBy', () => {
    const rendered = renderWithRedux(
      <>
        <FilterToolbar />
        <CommonModal />
      </>,
    );
    const { result } = renderHook(() => useFilterToolbarStore((state) => state));

    const btnFilterCreatedBy = rendered.getByTestId(
      'filter_tool_bar.filter_created_by-selected',
    );
    act(() => {
      fireEvent.press(btnFilterCreatedBy);
    });

    act(() => {
      result.current.actions.setSearchUser({ items: userSearchResult.data, loading: false, hasNextPage: true });
    });

    act(() => {
      result.current.actions.setSearchUser({ items: userSearchResult.data, loading: false, hasNextPage: true });
    });

    const userItem = rendered.getByTestId(
      `user_${userSearchResult.data[0].id}`,
    );
    act(() => {
      fireEvent.press(userItem);
    });

    expect(result.current.createdBy?.id).toEqual(userSearchResult.data[0].id);
    expect(result.current.createdBy?.name).toEqual(userSearchResult.data[0].fullname);
  });

  it('should call onSelectPostType', () => {
    const rendered = renderWithRedux(
      <>
        <FilterToolbar />
        <CommonModal />
      </>,
    );
    const { result } = renderHook(() => useFilterToolbarStore((state) => state));

    const btnFilterPostType = rendered.getByTestId(
      'filter_tool_bar.btn_filter_post_type-selected',
    );
    act(() => {
      fireEvent.press(btnFilterPostType);
    });

    const btnPost = rendered.getByTestId(`btn_post_type_${PostType.POST}`);

    act(() => {
      fireEvent.press(btnPost);
    });

    expect(result.current.postType).toEqual(PostType.POST);
  });

  it('should call onSelectDate', () => {
    const rendered = renderWithRedux(
      <>
        <FilterToolbar />
        <CommonModal />
      </>,
    );
    const { result } = renderHook(() => useFilterToolbarStore((state) => state));

    const btnFilterDate = rendered.getByTestId(
      'filter_tool_bar.filter_date_option-selected',
    );
    act(() => {
      fireEvent.press(btnFilterDate);
    });

    const btnToday = rendered.getByTestId(`btn_option_select_date_${TypeFilter.Today}`);

    act(() => {
      fireEvent.press(btnToday);
    });

    expect(result.current.datePosted?.startDate).toEqual(startOfTime(TypeFilter.Today).toISOString());
    expect(result.current.datePosted?.endDate).toEqual(endOfTime(TypeFilter.Today).toISOString());
  });

  it('should remove filter date correctly', () => {
    const rendered = renderWithRedux(
      <FilterToolbar />,
    );
    const { result } = renderHook(() => useFilterToolbarStore((state) => state));

    act(() => {
      result.current.actions.setFilterDatePosted({
        startDate: '2023-02-08T17:00:00.000Z',
        endDate: '2023-02-13T16:59:59.999Z',
      });
    });

    const btnRemoveFilterDate = rendered.getByTestId(
      'tag.icon',
    );
    act(() => {
      fireEvent.press(btnRemoveFilterDate);
    });

    expect(result.current.datePosted?.startDate).toEqual(undefined);
    expect(result.current.datePosted?.endDate).toEqual(undefined);
  });

  it('should remove filter created by correctly', () => {
    const rendered = renderWithRedux(
      <FilterToolbar />,
    );
    const { result } = renderHook(() => useFilterToolbarStore((state) => state));

    act(() => {
      result.current.actions.setFilterCreateBy({
        id: '123',
        name: 'abc',
      });
    });

    const btnRemoveFilterCreatedBy = rendered.getByTestId(
      'tag.icon',
    );
    act(() => {
      fireEvent.press(btnRemoveFilterCreatedBy);
    });

    expect(result.current.createdBy).toEqual(undefined);
  });

  it('should remove filter post type correctly', () => {
    const rendered = renderWithRedux(
      <FilterToolbar />,
    );
    const { result } = renderHook(() => useFilterToolbarStore((state) => state));

    act(() => {
      result.current.actions.setFilterPostType(PostType.ARTICLE);
    });

    const btnRemoveFilterPostType = rendered.getByTestId(
      'tag.icon',
    );
    act(() => {
      fireEvent.press(btnRemoveFilterPostType);
    });

    expect(result.current.postType).toEqual(undefined);
  });
});
