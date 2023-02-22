import React from 'react';
import { userSearchResult } from '~/test/mock_data/home';
import {
  act, fireEvent, renderHook, renderWithRedux,
} from '~/test/testUtils';
import FilterCreateBySpecific from './FilterCreateBySpecific';
import useFilterToolbarStore from './store';

describe('FilterCreateBySpecific component', () => {
  it('should render correctly', () => {
    const { result } = renderHook(() => useFilterToolbarStore((state) => state));
    const { createdBy } = result.current;
    const onSelect = jest.fn();

    const rendered = renderWithRedux(
      <FilterCreateBySpecific
        selectedCreatedBy={createdBy}
        onSelect={onSelect}
      />,
    );

    act(() => {
      result.current.actions.setSearchUser({ items: userSearchResult.data.slice(0, 2) });
    });

    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should render selected correctly', () => {
    const { result } = renderHook(() => useFilterToolbarStore((state) => state));
    const onSelect = jest.fn();

    act(() => {
      result.current.actions.setFilterCreateBy({
        id: userSearchResult.data[0].id,
        name: userSearchResult.data[0].fullname,
      });
    });

    const rendered = renderWithRedux(
      <FilterCreateBySpecific
        selectedCreatedBy={result.current.createdBy}
        onSelect={onSelect}
      />,
    );

    act(() => {
      result.current.actions.setSearchUser({ items: userSearchResult.data });
    });

    const checkIcon = rendered.getByTestId(`filter_create_by_specific.check_${userSearchResult.data[0].id}`);

    expect(checkIcon).toBeDefined();
  });

  it('should pressable', () => {
    const { result } = renderHook(() => useFilterToolbarStore((state) => state));
    const { createdBy } = result.current;
    const onSelect = jest.fn();

    const rendered = renderWithRedux(
      <FilterCreateBySpecific
        selectedCreatedBy={createdBy}
        onSelect={onSelect}
      />,
    );

    act(() => {
      result.current.actions.setSearchUser({ items: userSearchResult.data });
    });

    const userItem = rendered.getByTestId(
      `user_${userSearchResult.data[0].id}`,
    );

    fireEvent.press(userItem);
    expect(onSelect).toBeCalled();
  });
});
