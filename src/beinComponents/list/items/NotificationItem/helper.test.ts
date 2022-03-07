import {cleanup} from '@testing-library/react-native';
import {SAMPLE_ACTIVITY_1, SAMPLE_ACTIVITY_2} from './constants';
import {getNotificationContent} from './helper';

afterEach(cleanup);

describe('NotificationItem helper', () => {
  it(`getNotificationContent type NEW_REPLY_TO_COMMENT_YOU_ARE_MENTIONED`, async () => {
    const activity = {
      ...SAMPLE_ACTIVITY_1,
      notification_type: 18,
    };
    const activities = [activity];
    expect(getNotificationContent(activities as any)).toStrictEqual({
      title: {
        actorNames: 'Trần Nam Anh',
        verbText: `replied to a comment you're mentioned`,
      },
      body: null,
    });
  });

  it(`getNotificationContent type NEW_REPLY_TO_COMMENT_YOU_ARE_MENTIONED`, async () => {
    const activity = {
      ...SAMPLE_ACTIVITY_1,
      notification_type: 22,
    };
    const activities = [activity, SAMPLE_ACTIVITY_2];
    expect(getNotificationContent(activities as any)).toStrictEqual({
      title: {
        actorNames: '2 people',
        verbText: `replied to a comment you're mentioned`,
      },
      body: null,
    });
  });

  it(`getNotificationContent type NEW_REPLY_TO_YOUR_COMMENT`, async () => {
    const activity = {
      ...SAMPLE_ACTIVITY_1,
      notification_type: 8,
    };
    const activities = [activity, activity];
    expect(getNotificationContent(activities as any)).toStrictEqual({
      title: {
        actorNames: 'Trần Nam Anh',
        verbText: `replied to your comment 2 times`,
      },
      body: null,
    });
  });

  it(`getNotificationContent type NEW_REPLY_TO_COMMENT_YOU_REPLIED`, async () => {
    const activity = {
      ...SAMPLE_ACTIVITY_1,
      notification_type: 17,
    };
    const activities = [activity];
    expect(getNotificationContent(activities as any)).toStrictEqual({
      title: {
        actorNames: 'Trần Nam Anh',
        verbText: 'replied to a comment you replied',
      },
      body: null,
    });
  });

  it(`getNotificationContent type NEW_COMMENT_TO_YOUR_POST`, async () => {
    const activity = {
      ...SAMPLE_ACTIVITY_1,
      notification_type: 7,
      reaction: {
        data: {
          content: 'test',
        },
      },
    };
    const activities = [activity];

    expect(getNotificationContent(activities as any)).toStrictEqual({
      title: {
        actorNames: 'Trần Nam Anh',
        verbText: 'commented on your post',
      },
      body: 'test',
    });
  });

  it(`getNotificationContent type NEW_COMMENT_TO_A_POST`, async () => {
    const activity = {
      ...SAMPLE_ACTIVITY_1,
      notification_type: 19,
    };
    const activities = [activity];

    expect(getNotificationContent(activities as any)).toStrictEqual({
      title: {
        actorNames: 'Trần Nam Anh',
        verbText: 'also commented on a post',
      },
      body: null,
    });
  });

  it(`getNotificationContent type NEW_COMMENT_TO_POST_YOU_ARE_MENTIONED`, async () => {
    const activity = {
      ...SAMPLE_ACTIVITY_1,
      notification_type: 21,
    };
    const activities = [activity];

    expect(getNotificationContent(activities as any)).toStrictEqual({
      title: {
        actorNames: 'Trần Nam Anh',
        verbText: `commented on a post you're mentioned`,
      },
      body: null,
    });
  });

  it(`getNotificationContent type NEW_REACTION_TO_YOUR_POST`, async () => {
    const activity = {
      ...SAMPLE_ACTIVITY_1,
      notification_type: 9,
      verb: 'smile',
    };
    const activities = [activity];

    expect(getNotificationContent(activities as any)).toStrictEqual({
      title: {
        actorNames: 'Trần Nam Anh',
        verbText: {
          emoji: '😄',
          targetText: 'to your post',
        },
      },
      body: null,
    });
  });

  it(`getNotificationContent type NEW_REACTION_TO_YOUR_COMMENT`, async () => {
    const activity = {
      ...SAMPLE_ACTIVITY_1,
      notification_type: 10,
      verb: 'smile',
      parent_reaction: {
        data: {
          content: 'test',
        },
      },
    };
    const activities = [activity];

    expect(getNotificationContent(activities as any)).toStrictEqual({
      title: {
        actorNames: 'Trần Nam Anh',
        verbText: {
          emoji: '😄',
          targetText: 'to your comment',
        },
      },
      body: 'test',
    });
  });

  it(`getNotificationContent type NEW_REACTION_TO_YOUR_COMMENT`, async () => {
    const activity = {
      ...SAMPLE_ACTIVITY_1,
      notification_type: 16,
      parent_reaction: {
        data: {
          content: 'test',
        },
      },
    };
    const activities = [activity];

    expect(getNotificationContent(activities as any)).toStrictEqual({
      title: {
        actorNames: 'Trần Nam Anh',
        verbText: 'mentioned you in a comment',
      },
      body: 'test',
    });
  });

  it(`getNotificationContent type MENTION`, async () => {
    const activity = {
      ...SAMPLE_ACTIVITY_1,
      object: {
        actor: {
          data: {
            fullName: 'Trần Nam Anh',
          },
        },
      },
      notification_type: 4,
      verb: 'mention',
    };
    const activities = [activity];

    expect(getNotificationContent(activities as any)).toStrictEqual({
      title: {
        actorNames: 'Trần Nam Anh',
        verbText: 'mentioned you in a post',
        groupText: undefined,
      },
      body: undefined,
    });
  });

  it(`getNotificationContent type MENTION with group`, async () => {
    const activity = {
      ...SAMPLE_ACTIVITY_1,
      notification_type: 4,
      verb: 'post',
      actor: null,
      data: {
        content: 'test',
      },
      audience: {
        groups: [
          {
            id: '6',
            collection: 'groups',
            foreign_id: 'groups:6',
            data: {
              icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
              name: 'EVOL Community',
            },
            created_at: '2022-01-14T07:42:18.184353Z',
            updated_at: '2022-01-14T07:42:18.184353Z',
          },
        ],
        users: [],
      },
    };
    const activities = [activity];

    expect(getNotificationContent(activities as any)).toStrictEqual({
      title: {
        actorNames: 'Someone',
        verbText: 'created a post',
        groupText: 'in EVOL Community',
      },
      body: 'test',
    });
  });
});

it(`getNotificationContent type undefined`, async () => {
  const activity = {
    ...SAMPLE_ACTIVITY_1,
    object: {
      actor: {
        data: {
          fullName: 'Trần Nam Anh',
        },
      },
    },
    notification_type: undefined,
    verb: 'mention',
  };
  const activities = [activity];

  expect(getNotificationContent(activities as any)).toStrictEqual({
    title: {
      actorNames: 'Trần Nam Anh',
      verbText: 'mentioned you in a post',
      groupText: undefined,
    },
    body: undefined,
  });
});

it(`getNotificationContent type not implemented`, async () => {
  const activity = {
    ...SAMPLE_ACTIVITY_1,
    notification_type: 999,
  };
  const activities = [activity];

  expect(getNotificationContent(activities as any)).toBeNull();
});

it(`getNotificationContent no activity`, async () => {
  const activities: never[] = [];

  expect(getNotificationContent(activities)).toBeNull();
});
