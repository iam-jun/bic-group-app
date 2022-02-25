import React from 'react';
import {cleanup} from '@testing-library/react-native';

import {renderWithRedux, fireEvent} from '~/test/testUtils';
import ListView from './ListView';
import {colors} from '~/theme';

afterEach(cleanup);

describe('ListView component', () => {
  const data = [1, 2, 3];

  it('renders correctly', () => {
    const rendered = renderWithRedux(<ListView data={data} />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('renders containerStyle correctly', () => {
    const {getByTestId} = renderWithRedux(
      <ListView
        data={data}
        containerStyle={{backgroundColor: 'red', margin: 12}}
      />,
    );
    const component = getByTestId('list_view');
    expect(component.props.style).toMatchObject({
      backgroundColor: 'red',
      margin: 12,
    });
  });

  it('renders listStyle correctly', () => {
    const {getByTestId} = renderWithRedux(
      <ListView data={data} listStyle={{backgroundColor: 'red', margin: 12}} />,
    );
    const component = getByTestId('list_view.flat_list');
    expect(component.props.style).toMatchObject({
      backgroundColor: 'red',
      margin: 12,
    });
  });

  it('renders isFullView correctly', () => {
    const {getByTestId} = renderWithRedux(<ListView isFullView data={data} />);
    const component = getByTestId('list_view');
    expect(component.props.style).toMatchObject({flex: 1});
  });

  it('renders horizontal correctly', () => {
    const {getByTestId} = renderWithRedux(<ListView horizontal data={data} />);
    const component = getByTestId('list_view.flat_list');
    expect(component.props.horizontal).toBe(true);
  });

  it('renders title correctly', () => {
    const title = 'Sample Title';
    const {getByTestId} = renderWithRedux(
      <ListView title={title} data={data} />,
    );
    const component = getByTestId('list_view.title');
    expect(component.props.children).toBe(title);
  });
});
