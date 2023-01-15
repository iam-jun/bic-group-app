import React from 'react';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import ArticleSelectingInfo from '.';

const mockData = { id: 1, name: 'Name' };

describe('ArticleSelectingInfo Component', () => {
  it('renders correctly', () => {
    const rendered = renderWithRedux(
      <ArticleSelectingInfo
        data={mockData}
      />,
    );
    expect(rendered).toMatchSnapshot();
  });
  it('renders correctly with prop isChecked = true', () => {
    const rendered = renderWithRedux(
      <ArticleSelectingInfo
        data={mockData}
        isChecked
      />,
    );
    expect(rendered).toMatchSnapshot();
  });
  it('renders correctly with prop disabled = true', () => {
    const rendered = renderWithRedux(
      <ArticleSelectingInfo
        data={mockData}
        disabled
      />,
    );
    expect(rendered).toMatchSnapshot();
  });
  it('should call prop onRemoveItem', () => {
    const onRemoveItem = jest.fn();
    const rendered = renderWithRedux(
      <ArticleSelectingInfo
        data={mockData}
        isChecked
        onRemoveItem={onRemoveItem}
      />,
    );
    const componentCheckbox = rendered.getByTestId('aritcles.slecting_info_item.checkbox');
    expect(componentCheckbox).toBeDefined();

    fireEvent.press(componentCheckbox);
    expect(onRemoveItem).toBeCalledWith(mockData);
  });
  it('should call prop onAddItem', () => {
    const onAddItem = jest.fn();
    const rendered = renderWithRedux(
      <ArticleSelectingInfo
        data={mockData}
        onAddItem={onAddItem}
      />,
    );
    const componentCheckbox = rendered.getByTestId('aritcles.slecting_info_item.checkbox');
    expect(componentCheckbox).toBeDefined();

    fireEvent.press(componentCheckbox);
    expect(onAddItem).toBeCalledWith(mockData);
  });
});
