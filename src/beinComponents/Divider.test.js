import * as React from 'react';
import renderer from 'react-test-renderer';
import Divider from '~/beinComponents/Divider';

describe('Divider component', () => {
  it(`renders correctly`, () => {
    const tree = renderer.create(<Divider />);
    expect(tree).toMatchSnapshot();
  });
  it(`renders correctly horizontal`, () => {
    const tree = renderer.create(
      <Divider horizontal={true} color={'#B2BDCD'} />,
    );
    expect(tree).toMatchSnapshot();
  });
});
