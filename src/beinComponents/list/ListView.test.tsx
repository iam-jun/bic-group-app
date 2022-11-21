import React from 'react';
import { cleanup } from '@testing-library/react-native';

import { View } from 'react-native';
import { renderWithRedux, fireEvent } from '~/test/testUtils';
import ListView from './ListView';
import Text from '~/baseComponents/Text';

afterEach(cleanup);

describe('ListView component', () => {
  const data = [1, 2, 3];
  const renderItem = ({ item }: {item: any; index: number}) => (
    <Text>{item}</Text>
  );

  it('renders correctly', () => {
    const rendered = renderWithRedux(
      <ListView data={data} renderItem={renderItem} />,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('renders data correctly', () => {
    const { getByTestId } = renderWithRedux(
      <ListView data={data} renderItem={renderItem} />,
    );
    const component = getByTestId('list_view.flat_list');
    expect(component.props.children[1].props.children.length).toBe(data.length);
  });

  it('renders containerStyle correctly', () => {
    const { getByTestId } = renderWithRedux(
      <ListView
        data={data}
        renderItem={renderItem}
        containerStyle={{ backgroundColor: 'red', margin: 12 }}
      />,
    );
    const component = getByTestId('list_view');
    expect(component.props.style).toMatchObject({
      backgroundColor: 'red',
      margin: 12,
    });
  });

  it('renders listStyle correctly', () => {
    const { getByTestId } = renderWithRedux(
      <ListView
        data={data}
        renderItem={renderItem}
        listStyle={{ backgroundColor: 'red', margin: 12 }}
      />,
    );
    const component = getByTestId('list_view.flat_list');
    expect(component.props.style).toMatchObject({
      backgroundColor: 'red',
      margin: 12,
    });
  });

  it('should call prop renderItem correctly', () => {
    const renderItemTest = jest.fn();
    renderWithRedux(<ListView data={data} renderItem={renderItemTest} />);

    expect(renderItemTest).toBeCalled();
  });

  it('renders loading correctly', () => {
    const { getByTestId } = renderWithRedux(
      <ListView data={data} renderItem={renderItem} loading />,
    );

    const indicator = getByTestId('list_view.indicator.loading');
    expect(indicator).toBeDefined();
    expect(indicator.type).toBe('ActivityIndicator');
  });

  it('renders renderLoading prop correctly', () => {
    const renderLoading = jest.fn();
    renderWithRedux(
      <ListView
        data={data}
        renderItem={renderItem}
        loading
        renderLoading={renderLoading}
      />,
    );

    expect(renderLoading).toBeCalled();
  });

  it('renders LoadingPlaceholder correctly', () => {
    const { getByTestId } = renderWithRedux(
      <ListView data={data} renderItem={renderItem} loading type="message" />,
    );
    const LoadingPlaceholder = getByTestId('list_view.loading_placeholder');
    expect(LoadingPlaceholder).toBeDefined();
  });

  it('renders isFullView correctly', () => {
    const { getByTestId } = renderWithRedux(
      <ListView isFullView data={data} renderItem={renderItem} />,
    );
    const component = getByTestId('list_view');
    expect(component.props.style).toMatchObject({ flex: 1 });
  });

  it('renders horizontal correctly', () => {
    const { getByTestId } = renderWithRedux(
      <ListView horizontal data={data} renderItem={renderItem} />,
    );
    const component = getByTestId('list_view.flat_list');
    expect(component.props.horizontal).toBe(true);
  });

  it('renders title correctly', () => {
    const title = 'Sample Title';
    const { getByTestId } = renderWithRedux(
      <ListView title={title} data={data} renderItem={renderItem} />,
    );
    const component = getByTestId('list_view.title');
    expect(component.props.children).toBe(title);
  });

  it('renders loadingMore correctly', () => {
    const { getByTestId } = renderWithRedux(
      <ListView loadingMore data={data} renderItem={renderItem} />,
    );
    const indicator = getByTestId('list_view.indicator.loading_more');
    expect(indicator).toBeDefined();
    expect(indicator.type).toBe('ActivityIndicator');
  });

  it('renders showItemSeparator = false correctly', () => {
    const { getByTestId } = renderWithRedux(
      <ListView
        showItemSeparator={false}
        data={data}
        renderItem={renderItem}
      />,
    );
    const flatList = getByTestId('list_view.flat_list');
    expect(flatList).toBeDefined();
    expect(flatList.props.ItemSeparatorComponent()).toBe(null);
  });

  it('should call prop renderItemSeparator correctly', () => {
    const renderItemSeparator = () => <View />;
    const { getByTestId } = renderWithRedux(
      <ListView
        data={data}
        renderItem={renderItem}
        renderItemSeparator={renderItemSeparator}
      />,
    );
    const flatList = getByTestId('list_view.flat_list');
    expect(flatList).toBeDefined();
    expect(flatList.props.ItemSeparatorComponent()).toStrictEqual(<View />);
  });

  it('should call prop onLoadMore correctly', () => {
    const onLoadMore = () => 'onLoadMore';
    const { getByTestId } = renderWithRedux(
      <ListView data={data} renderItem={renderItem} onLoadMore={onLoadMore} />,
    );
    const flatList = getByTestId('list_view.flat_list');
    expect(flatList).toBeDefined();
    expect(flatList.props.onEndReached()).toEqual('onLoadMore');
  });

  it('should call prop onItemPress correctly', () => {
    const onItemPress = jest.fn();
    const { getByTestId } = renderWithRedux(
      <ListView data={data} onItemPress={onItemPress} />,
    );
    const item = getByTestId('list_view.item_wrapper.1');
    fireEvent.press(item);
    expect(onItemPress).toBeCalled();
  });

  it('should call prop onItemLongPress correctly', () => {
    const onItemPress = jest.fn();
    const onItemLongPress = jest.fn();
    const { getByTestId } = renderWithRedux(
      <ListView
        data={data}
        onItemPress={onItemPress}
        onItemLongPress={onItemLongPress}
      />,
    );
    const item = getByTestId('list_view.item_wrapper.1');
    fireEvent(item, 'onLongPress');
    expect(onItemLongPress).toBeCalled();
  });
});
