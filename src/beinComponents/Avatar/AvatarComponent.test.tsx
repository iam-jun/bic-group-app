import * as React from 'react';
import {render, cleanup} from '@testing-library/react-native';

import Avatar from '~/beinComponents/Avatar';

afterEach(cleanup);

describe('Divider component', () => {
  it(`renders correctly`, () => {
    const avatarLink =
      '	https://bein-entity-attribute-sandbox.s3.ap-southe…riginal/f3f4639e-6b1c-478f-ba6b-be1559197199.jpeg';
    const rendered = render(<Avatar.Large source={avatarLink} />).toJSON();
    expect(rendered).toMatchSnapshot();
  });
});
