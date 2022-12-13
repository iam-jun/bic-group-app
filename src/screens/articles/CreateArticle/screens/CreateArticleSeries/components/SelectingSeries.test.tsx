import * as React from 'react';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import SelectingSeries from './SelectingSeries';

describe('SelectingSeries component', () => {
  const selectedSeries = [
    {
      id: 'id_string',
      title: 'title string',
    },
  ];

  it('render correctly', () => {
    const onRemoveSeries = jest.fn();
    const wrapper = renderWithRedux(<SelectingSeries
      data={selectedSeries}
      onRemoveItem={onRemoveSeries}
    />);
    expect(wrapper.toJSON()).toMatchSnapshot();
  });

  it('should call onRemoveItem when click icon X', () => {
    const onRemoveSeries = jest.fn();
    const wrapper = renderWithRedux(<SelectingSeries
      data={selectedSeries}
      onRemoveItem={onRemoveSeries}
    />);
    const component = wrapper.getAllByTestId('tag.icon');
    expect(component).toBeDefined();

    fireEvent.press(component[0]);
    expect(onRemoveSeries).toBeCalled();
  });

  it('render correctly when data is empty', () => {
    const onRemoveSeries = jest.fn();
    const wrapper = renderWithRedux(<SelectingSeries
      data={[]}
      onRemoveItem={onRemoveSeries}
    />);
    expect(wrapper.toJSON()).toMatchSnapshot();
  });
});
