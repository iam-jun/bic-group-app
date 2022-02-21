import * as React from 'react';
import {render, cleanup} from '@testing-library/react-native';
import TimeView from '~/beinComponents/TimeView';

afterEach(cleanup);

describe('TimeView component', () => {
  it(`renders correctly`, () => {
    const rendered = render(
      <TimeView time="2022-02-21T02:15:39.594061" type="short" />,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });
});
