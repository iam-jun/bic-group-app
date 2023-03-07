import React from 'react';
import { ContentHeader } from '~/components/ContentView';
import useNetworkStore, { INetworkState } from '~/store/network';
import { fireEvent, renderWithRedux } from '~/test/testUtils';

describe('ContentHeader component', () => {
  it('render correctly', () => {
    const rendered = renderWithRedux(<ContentHeader
      actor="actor"
      disabled={false}
      audience={{}}
    />);
    expect(rendered).toMatchSnapshot();
  });

  it('should call onPressShowAudiences', () => {
    const onPress = jest.fn();
    const rendered = renderWithRedux(<ContentHeader
      actor="actor"
      disabled={false}
      audience={{}}
      onPressShowAudiences={onPress}
    />);
    const headerAudience = rendered.getByTestId('content_header.audiences');
    fireEvent.press(headerAudience);
    expect(onPress).toBeCalled();
  });

  it('should not call onPressShowAudiences when cant connect to the internet', () => {
    useNetworkStore.setState((state:INetworkState) => {
      state.isInternetReachable = false;
      return state;
    });

    const onPress = jest.fn();
    const rendered = renderWithRedux(<ContentHeader
      actor="actor"
      disabled={false}
      audience={{}}
      onPressShowAudiences={onPress}
    />);
    const headerAudience = rendered.getByTestId('content_header.audiences');
    fireEvent.press(headerAudience);
    expect(onPress).not.toBeCalled();
  });
});
