import {cleanup, render} from '@testing-library/react-native';
import React from 'react';
import {
  CHILD_COMMENT,
  LOAD_MORE_RESPONSE,
} from '~/test/mock_data/notifications';
import {renderWithRedux} from '~/test/testUtils';
import NotificationContent from '.';

afterEach(cleanup);

describe('NotificationContent component', () => {
  it(`renders correctly`, async () => {
    const extra = LOAD_MORE_RESPONSE[0].extra;
    const verb = LOAD_MORE_RESPONSE[0].verb;
    const actorCount = LOAD_MORE_RESPONSE[0].actorCount;
    const activities = LOAD_MORE_RESPONSE[0].activities;
    const wrapper = renderWithRedux(
      <NotificationContent
        description={extra?.description || ''}
        defaultContent={extra?.content || ''}
        activities={activities}
        verb={verb}
        actorCount={actorCount}
      />,
    );
    const rendered = wrapper.toJSON();

    expect(rendered).toMatchSnapshot();
  });

  it(`should show "NotificationContent" without description and content is comment lv1 content`, async () => {
    const verb = LOAD_MORE_RESPONSE[0].verb;
    const actorCount = LOAD_MORE_RESPONSE[0].actorCount;
    const activities = LOAD_MORE_RESPONSE[0].activities;

    const wrapper = render(
      <NotificationContent
        description={''}
        defaultContent={''}
        activities={activities}
        verb={verb}
        actorCount={actorCount}
      />,
    );
    const description = wrapper.getByTestId('notification_content.description');
    const content = wrapper.queryByTestId('notification_content.content');

    expect(description).not.toBeNull();
    expect(content).not.toBeNull();
  });

  it(`should show "NotificationContent" with description and content is comment lv2 content`, async () => {
    const commentHasChild = {
      ...LOAD_MORE_RESPONSE[0].activities[0],
      comment: {
        ...LOAD_MORE_RESPONSE[0].activities[0].comment,
        child: CHILD_COMMENT,
      },
    };
    const NOTIFICATION_COMMENT_LV2 = {
      ...LOAD_MORE_RESPONSE[0],
      activities: [commentHasChild],
    };
    const extra = LOAD_MORE_RESPONSE[0].extra;
    const verb = NOTIFICATION_COMMENT_LV2.verb;
    const actorCount = NOTIFICATION_COMMENT_LV2.actorCount;
    const activities = NOTIFICATION_COMMENT_LV2.activities;

    const wrapper = render(
      <NotificationContent
        description={extra.description}
        defaultContent={extra.content}
        activities={activities}
        verb={verb}
        actorCount={actorCount}
      />,
    );
    const description = wrapper.getByTestId('notification_content.description');
    const content = wrapper.queryByTestId('notification_content.content');

    expect(description).not.toBeNull();
    expect(content).toBeDefined();

    //@ts-ignore
    expect(content.props?.children).toBe(CHILD_COMMENT.content);
  });

  it(`should show "NotificationContent" with description and content is comment lv1 content in verb REACT`, async () => {
    const extra = LOAD_MORE_RESPONSE[0].extra;
    const actorCount = LOAD_MORE_RESPONSE[0].actorCount;
    const activities = LOAD_MORE_RESPONSE[0].activities;

    const wrapper = render(
      <NotificationContent
        description={extra.description}
        defaultContent={extra.content}
        activities={activities}
        verb={'REACT'}
        actorCount={actorCount}
      />,
    );
    const description = wrapper.getByTestId('notification_content.description');
    const content = wrapper.queryByTestId('notification_content.content');

    expect(description).not.toBeNull();
    expect(content).toBeDefined();

    //@ts-ignore
    expect(content.props?.children).toBe(activities[0].comment.content);
  });

  it(`should show "NotificationContent" with not description and content is comment lv2 content  in verb REACT`, async () => {
    const commentHasChild = {
      ...LOAD_MORE_RESPONSE[0].activities[0],
      comment: {
        ...LOAD_MORE_RESPONSE[0].activities[0].comment,
        child: CHILD_COMMENT,
      },
    };
    const NOTIFICATION_COMMENT_LV2 = {
      ...LOAD_MORE_RESPONSE[0],
      activities: [commentHasChild],
    };
    const extra = LOAD_MORE_RESPONSE[0].extra;
    const actorCount = NOTIFICATION_COMMENT_LV2.actorCount;
    const activities = NOTIFICATION_COMMENT_LV2.activities;

    const wrapper = render(
      <NotificationContent
        description={extra.description}
        defaultContent={extra.content}
        activities={activities}
        verb={'REACT'}
        actorCount={actorCount}
      />,
    );
    const description = wrapper.getByTestId('notification_content.description');
    const content = wrapper.queryByTestId('notification_content.content');

    expect(description).not.toBeNull();
    expect(content).toBeDefined();

    //@ts-ignore
    expect(content.props?.children).toBe(CHILD_COMMENT.content);
  });

  it(`should show "NotificationContent" with description and content is extra content in verb POST`, async () => {
    const extra = LOAD_MORE_RESPONSE[0].extra;
    const actorCount = LOAD_MORE_RESPONSE[0].actorCount;
    const activities = LOAD_MORE_RESPONSE[0].activities;

    const wrapper = render(
      <NotificationContent
        description={extra.description}
        defaultContent={extra.content}
        activities={activities}
        verb={'POST'}
        actorCount={actorCount}
      />,
    );
    const description = wrapper.getByTestId('notification_content.description');
    const content = wrapper.queryByTestId('notification_content.content');

    expect(description).not.toBeNull();
    expect(content).toBeDefined();

    //@ts-ignore
    expect(content.props?.children).toBe(extra.content);
  });

  it(`should show "NotificationContent" with description and content is extra content in verb REACT and actorCount > 1`, async () => {
    const extra = LOAD_MORE_RESPONSE[0].extra;
    const activities = LOAD_MORE_RESPONSE[0].activities;

    const wrapper = render(
      <NotificationContent
        description={extra.description}
        defaultContent={extra.content}
        activities={activities}
        verb={'POST'}
        actorCount={2}
      />,
    );
    const description = wrapper.getByTestId('notification_content.description');
    const content = wrapper.queryByTestId('notification_content.content');

    expect(description).not.toBeNull();
    expect(content).toBeDefined();

    //@ts-ignore
    expect(content.props?.children).toBe(extra.content);
  });
});
