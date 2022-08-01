import {cleanup} from '@testing-library/react-native';
import React from 'react';

import {
  CHILD_COMMENT,
  LOAD_MORE_RESPONSE,
} from '~/test/mock_data/notifications';
import {configureStore, renderWithRedux} from '~/test/testUtils';
import NotificationAvatar from './NotificationAvatar';
import initialState from '~/store/initialState';
import {USER_PROFILE} from '~/test/mock_data/menu';

afterEach(cleanup);

describe('NotificationAvatar component', () => {
  const mockStore = configureStore([]);
  let storeData: any;
  const defaultActor = LOAD_MORE_RESPONSE[0].extra.actor;

  beforeEach(() => {
    jest.clearAllMocks();
    storeData = {...initialState};
    const user = {
      signInUserSession: {
        idToken: {payload: {'custom:bein_user_id': USER_PROFILE.id}},
      },
    };

    storeData.auth.user = user as any;
  });

  it(`renders correctly with COMMENT verb with action comment lv1`, async () => {
    const verb = LOAD_MORE_RESPONSE[0].verb;
    const actorCount = LOAD_MORE_RESPONSE[0].actorCount;
    const activities = LOAD_MORE_RESPONSE[0].activities;

    const store = mockStore(storeData);
    const wrapper = renderWithRedux(
      <NotificationAvatar
        actor={defaultActor}
        activities={activities}
        actorCount={actorCount}
        verb={verb}
        isRead={true}
      />,
      store,
    );

    const rendered = wrapper.toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it(`renders correctly with COMMENT verb with action comment lv2`, async () => {
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

    const verb = NOTIFICATION_COMMENT_LV2.verb;
    const actorCount = NOTIFICATION_COMMENT_LV2.actorCount;
    const activities = NOTIFICATION_COMMENT_LV2.activities;

    const store = mockStore(storeData);
    const wrapper = renderWithRedux(
      <NotificationAvatar
        actor={defaultActor}
        activities={activities}
        actorCount={actorCount}
        verb={verb}
        isRead={true}
      />,
      store,
    );

    const rendered = wrapper.toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it(`renders correctly with action comment lv2`, async () => {
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

    const verb = NOTIFICATION_COMMENT_LV2.verb;
    const actorCount = NOTIFICATION_COMMENT_LV2.actorCount;
    const activities = NOTIFICATION_COMMENT_LV2.activities;

    const store = mockStore(storeData);
    const wrapper = renderWithRedux(
      <NotificationAvatar
        actor={defaultActor}
        activities={activities}
        actorCount={actorCount}
        verb={verb}
        isRead={true}
      />,
      store,
    );

    const rendered = wrapper.toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it(`renders correctly with action REACT post`, async () => {
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

    const verb = NOTIFICATION_COMMENT_LV2.verb;
    const actorCount = NOTIFICATION_COMMENT_LV2.actorCount;
    const activities = NOTIFICATION_COMMENT_LV2.activities;

    const store = mockStore(storeData);
    const wrapper = renderWithRedux(
      <NotificationAvatar
        actor={defaultActor}
        activities={activities}
        actorCount={actorCount}
        verb={'REACT'}
        isRead={true}
      />,
      store,
    );

    const rendered = wrapper.toJSON();
    expect(rendered).toMatchSnapshot();
  });
});
