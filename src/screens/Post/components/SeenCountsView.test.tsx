import * as React from 'react';
import {render, cleanup} from '@testing-library/react-native';
import SeenCountsView from './SeenCountsView';
import {fireEvent} from '~/test/testUtils';
afterEach(cleanup);

describe('SeenCountsView', () => {
  it(`renders correctly`, () => {
    const rendered = render(<SeenCountsView />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('onpress seen by', () => {
    const onPress = jest.fn();
    const {getByTestId} = render(
      <SeenCountsView seenPeopleCount={3} onPress={onPress} />,
    );
    const seenCountsViewComponent = getByTestId('text_seen_counts');
    expect(seenCountsViewComponent.props.children[1]).toBe(3);
    const btn = getByTestId('onPress_seen_by');
    fireEvent.press(btn);
    expect(onPress).toBeCalled();
  });
});
