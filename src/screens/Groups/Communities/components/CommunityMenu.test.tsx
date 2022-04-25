import * as React from 'react';
import {cleanup, render} from '@testing-library/react-native';

import CommunityMenu from './CommunityMenu';
import {renderWithRedux} from '~/test/testUtils';

afterEach(cleanup);

describe('CommunityMenu component', () => {
  it(`renders correctly`, () => {
    const onPress = jest.fn();
    const rendered = renderWithRedux(
      <CommunityMenu selectedIndex={0} onPress={onPress} />,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  //   it(`renders correctly color`, () => {
  //     const {getByTestId} = render(<Divider color={'#B2BDCD'} />);
  //     const dividerComponent = getByTestId('divider');
  //     expect(dividerComponent.props.style[0].backgroundColor).toBe('#B2BDCD');
  //   });

  //   it(`renders correctly horizontal`, () => {
  //     const {getByTestId} = render(<Divider horizontal={true} />);
  //     const dividerComponent = getByTestId('divider');
  //     expect(dividerComponent.props.style[0].height).toBe(undefined);
  //   });
});
