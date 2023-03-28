import React from 'react';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import ItemCheckbox from '.';

const mockData = { id: 1, name: 'Name' };

describe('ItemCheckbox Component', () => {
  it('renders correctly', () => {
    const rendered = renderWithRedux(
      <ItemCheckbox
        data={mockData}
      />,
    );
    expect(rendered).toMatchSnapshot();
  });
  it('renders correctly with prop isChecked = true', () => {
    const rendered = renderWithRedux(
      <ItemCheckbox
        data={mockData}
        isChecked
      />,
    );
    expect(rendered).toMatchSnapshot();
  });
  it('renders correctly with prop disabled = true', () => {
    const rendered = renderWithRedux(
      <ItemCheckbox
        data={mockData}
        disabled
      />,
    );
    expect(rendered).toMatchSnapshot();
  });
  it('should call prop onRemoveItem', () => {
    const onRemoveItem = jest.fn();
    const rendered = renderWithRedux(
      <ItemCheckbox
        data={mockData}
        isChecked
        testIDCheckbox="item_checkbox.checkbox"
        onRemoveItem={onRemoveItem}
      />,
    );
    const componentCheckbox = rendered.getByTestId('item_checkbox.checkbox');
    expect(componentCheckbox).toBeDefined();

    fireEvent.press(componentCheckbox);
    expect(onRemoveItem).toBeCalledWith(mockData);
  });
  it('should call prop onAddItem', () => {
    const onAddItem = jest.fn();
    const rendered = renderWithRedux(
      <ItemCheckbox
        data={mockData}
        testIDCheckbox="item_checkbox.checkbox"
        onAddItem={onAddItem}
      />,
    );
    const componentCheckbox = rendered.getByTestId('item_checkbox.checkbox');
    expect(componentCheckbox).toBeDefined();

    fireEvent.press(componentCheckbox);
    expect(onAddItem).toBeCalledWith(mockData);
  });
});
