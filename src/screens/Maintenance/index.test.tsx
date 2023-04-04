import * as React from 'react';
import { act } from '@testing-library/react-hooks';
import { render } from '~/test/testUtils';
import Maintenance from './index';
import streamApi from '~/api/StreamApi';

describe('Maintenance component', () => {
  it('render correctly', async () => {
    const spy = jest.spyOn(streamApi, 'getNewsfeed').mockImplementation(() => Promise.resolve() as any);

    const wrapper = render(<Maintenance />);
    const { getByTestId } = wrapper;
    const containerComponent = getByTestId('maintenance');
    expect(containerComponent).toBeDefined();

    const { refreshControl } = containerComponent.props;
    await act(async () => {
      refreshControl.props.onRefresh();
    });
    expect(spy).toBeCalled();
  });
});
