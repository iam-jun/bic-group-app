import { cleanup, render } from '@testing-library/react-native';
import React from 'react';
import {
  CHILD_COMMENT,
  LOAD_MORE_RESPONSE,
} from '~/test/mock_data/notifications';
import { renderWithRedux } from '~/test/testUtils';
import NotificationContent from '.';

afterEach(cleanup);

describe('NotificationContent component', () => {
  it('renders correctly', async () => {
    const { extra } = LOAD_MORE_RESPONSE[0];
    const wrapper = renderWithRedux(
      <NotificationContent
        description={extra?.description || ''}
      />,
    );
    const rendered = wrapper.toJSON();

    expect(rendered).toMatchSnapshot();
  });

  it('should show "NotificationContent" without description and content is comment lv1 content', async () => {
    const wrapper = render(
      <NotificationContent
        description=""
      />,
    );
    const description = wrapper.getByTestId('notification_content.description');
    const content = wrapper.queryByTestId('notification_content.content');

    expect(description).not.toBeNull();
    expect(content).not.toBeNull();
  });

  it('should show "NotificationContent" with description and content is comment lv2 content', async () => {
    const { extra } = LOAD_MORE_RESPONSE[0];

    const wrapper = render(
      <NotificationContent
        description={extra.description}
      />,
    );
    const description = wrapper.getByTestId('notification_content.description');
    const content = wrapper.queryByTestId('notification_content.content');

    expect(description).not.toBeNull();
    expect(content).toBeDefined();

    expect(content.props?.children).toBe(CHILD_COMMENT.content);
  });

  it('should show "NotificationContent" with description and content is comment lv1 content in verb REACT', async () => {
    const { extra } = LOAD_MORE_RESPONSE[0];
    const { activities } = LOAD_MORE_RESPONSE[0];

    const wrapper = render(
      <NotificationContent
        description={extra.description}
      />,
    );
    const description = wrapper.getByTestId('notification_content.description');
    const content = wrapper.queryByTestId('notification_content.content');

    expect(description).not.toBeNull();
    expect(content).toBeDefined();

    expect(content.props?.children).toBe(activities[0].comment.content);
  });

  it('should show "NotificationContent" with not description and content is comment lv2 content  in verb REACT', async () => {
    const { extra } = LOAD_MORE_RESPONSE[0];

    const wrapper = render(
      <NotificationContent
        description={extra.description}
      />,
    );
    const description = wrapper.getByTestId('notification_content.description');
    const content = wrapper.queryByTestId('notification_content.content');

    expect(description).not.toBeNull();
    expect(content).toBeDefined();

    expect(content.props?.children).toBe(CHILD_COMMENT.content);
  });

  it('should show "NotificationContent" with description and content is extra content in verb POST', async () => {
    const { extra } = LOAD_MORE_RESPONSE[0];

    const wrapper = render(
      <NotificationContent
        description={extra.description}
      />,
    );
    const description = wrapper.getByTestId('notification_content.description');
    const content = wrapper.queryByTestId('notification_content.content');

    expect(description).not.toBeNull();
    expect(content).toBeDefined();

    expect(content.props?.children).toBe(extra.content);
  });

  it('should show "NotificationContent" with description and content is extra content in verb REACT and actorCount > 1', async () => {
    const { extra } = LOAD_MORE_RESPONSE[0];

    const wrapper = render(
      <NotificationContent
        description={extra.description}
      />,
    );
    const description = wrapper.getByTestId('notification_content.description');
    const content = wrapper.queryByTestId('notification_content.content');

    expect(description).not.toBeNull();
    expect(content).toBeDefined();

    expect(content.props?.children).toBe(extra.content);
  });
});
