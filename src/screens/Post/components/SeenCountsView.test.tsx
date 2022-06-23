import * as React from 'react';
import {render, cleanup} from '@testing-library/react-native';
import SeenCountsView from './SeenCountsView';
import {fireEvent} from '~/test/testUtils';
afterEach(cleanup);

describe('SeenCountsView', () => {
  it(`renders correctly seen counts view`, () => {
    const rendered = render(<SeenCountsView />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('press container should call prop onPress', () => {
    const onPress = jest.fn();
    const {getByTestId} = render(
      <SeenCountsView seenPeopleCount={3} onPress={onPress} />,
    );
    const seenCountsViewComponent = getByTestId('txtSeenCountsTestID');
    expect(seenCountsViewComponent.props.children[1]).toBe(3);
    const btn = getByTestId('btnSeenCountsTestID');
    fireEvent.press(btn);
    expect(onPress).toBeCalled();
  });
});
