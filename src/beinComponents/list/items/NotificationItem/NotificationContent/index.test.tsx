import { cleanup } from '@testing-library/react-native';
import React from 'react';
import {
  LOAD_MORE_RESPONSE,
} from '~/test/mock_data/notifications';
import { renderWithRedux } from '~/test/testUtils';
import NotificationContent from '.';

afterEach(cleanup);

describe('NotificationContent component', () => {
  it('renders correctly', async () => {
    const { extra, updatedAt } = LOAD_MORE_RESPONSE[0];
    const wrapper = renderWithRedux(
      <NotificationContent
        description={extra.description}
        content={extra.content}
        updatedAt={updatedAt}
      />,
    );
    const rendered = wrapper.toJSON();

    expect(rendered).toMatchSnapshot();
  });
});
