import * as React from 'react';
import {cleanup} from '@testing-library/react-native';
import ReactionView from '~/beinComponents/ReactionView';
import {fireEvent, renderWithRedux, configureStore} from '~/test/testUtils';
import initialState from '~/store/initialState';

afterEach(cleanup);

describe('ReactionView component', () => {
  const mockStore = configureStore([]);

  const storeData = {...initialState};

  storeData.noInternet.isInternetReachable = true;

  const store = mockStore(storeData);

  it(`renders correctly`, () => {
    const onAddReaction = jest.fn();
    const onRemoveReaction = jest.fn();
    const onPressSelectReaction = jest.fn();
    const onLongPressReaction = jest.fn();
    const rendered = renderWithRedux(
      <ReactionView
        style={{}}
        ownReactions={ownReactions}
        reactionCounts={reactionCounts}
        reactionsOrder={reactionsOrder}
        showSelectReactionWhenEmpty
        onAddReaction={onAddReaction}
        onRemoveReaction={onRemoveReaction}
        onPressSelectReaction={onPressSelectReaction}
        onLongPressReaction={onLongPressReaction}
      />,
      store,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it(`renders correctly with props Reactions Order `, () => {
    const onAddReaction = jest.fn();
    const onRemoveReaction = jest.fn();
    const onPressSelectReaction = jest.fn();
    const onLongPressReaction = jest.fn();
    const rendered = renderWithRedux(
      <ReactionView
        ownReactions={ownReactions}
        reactionCounts={reactionCounts}
        reactionsOrder={reactionsOrder}
        showSelectReactionWhenEmpty
        onAddReaction={onAddReaction}
        onRemoveReaction={onRemoveReaction}
        onPressSelectReaction={onPressSelectReaction}
        onLongPressReaction={onLongPressReaction}
      />,
      store,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it(`renders correctly with props Reactions Order empty `, () => {
    const onAddReaction = jest.fn();
    const onRemoveReaction = jest.fn();
    const onPressSelectReaction = jest.fn();
    const onLongPressReaction = jest.fn();
    const rendered = renderWithRedux(
      <ReactionView
        style={{}}
        ownReactions={ownReactionsEmpty}
        reactionCounts={reactionCountsEmpty}
        reactionsOrder={[]}
        showSelectReactionWhenEmpty
        onAddReaction={onAddReaction}
        onRemoveReaction={onRemoveReaction}
        onPressSelectReaction={onPressSelectReaction}
        onLongPressReaction={onLongPressReaction}
      />,
      store,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it(`renders correctly with props showSelectReactionWhenEmpty`, () => {
    const onAddReaction = jest.fn();
    const onRemoveReaction = jest.fn();
    const onPressSelectReaction = jest.fn();
    const onLongPressReaction = jest.fn();
    const rendered = renderWithRedux(
      <ReactionView
        style={{}}
        ownReactions={ownReactionsEmpty}
        reactionCounts={reactionCountsEmpty}
        reactionsOrder={[]}
        showSelectReactionWhenEmpty
        onAddReaction={onAddReaction}
        onRemoveReaction={onRemoveReaction}
        onPressSelectReaction={onPressSelectReaction}
        onLongPressReaction={onLongPressReaction}
      />,
      store,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it(`renders correctly with props showSelectReactionWhenEmpty = false `, () => {
    const onAddReaction = jest.fn();
    const onRemoveReaction = jest.fn();
    const onPressSelectReaction = jest.fn();
    const onLongPressReaction = jest.fn();
    const rendered = renderWithRedux(
      <ReactionView
        style={{}}
        ownReactions={ownReactionsEmpty}
        reactionCounts={reactionCountsEmpty}
        reactionsOrder={[]}
        showSelectReactionWhenEmpty={false}
        onAddReaction={onAddReaction}
        onRemoveReaction={onRemoveReaction}
        onPressSelectReaction={onPressSelectReaction}
        onLongPressReaction={onLongPressReaction}
      />,
      store,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it(`renders correctly with props style`, () => {
    const onAddReaction = jest.fn();
    const onRemoveReaction = jest.fn();
    const onPressSelectReaction = jest.fn();
    const onLongPressReaction = jest.fn();
    const rendered = renderWithRedux(
      <ReactionView
        style={{backgroundColor: '#FF9800'}}
        ownReactions={ownReactions}
        reactionCounts={reactionCounts}
        reactionsOrder={reactionsOrder}
        showSelectReactionWhenEmpty
        onAddReaction={onAddReaction}
        onRemoveReaction={onRemoveReaction}
        onPressSelectReaction={onPressSelectReaction}
        onLongPressReaction={onLongPressReaction}
      />,
      store,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
    const reractionViewComp = rendered.getByTestId('reaction_view');
    expect(reractionViewComp).toBeDefined();
    expect(reractionViewComp.props.style[1]).toMatchObject({
      backgroundColor: '#FF9800',
    });
  });

  it(`renders correctly with props onPressSelectReaction `, () => {
    const onAddReaction = jest.fn();
    const onRemoveReaction = jest.fn();
    const onPressSelectReaction = jest.fn();
    const onLongPressReaction = jest.fn();
    const rendered = renderWithRedux(
      <ReactionView
        style={{}}
        ownReactions={ownReactionsEmpty}
        reactionCounts={reactionCountsEmpty}
        reactionsOrder={reactionsOrder}
        showSelectReactionWhenEmpty
        onAddReaction={onAddReaction}
        onRemoveReaction={onRemoveReaction}
        onPressSelectReaction={onPressSelectReaction}
        onLongPressReaction={onLongPressReaction}
      />,
      store,
    );
    const reactComponent = rendered.getByTestId('reaction_view.react');
    fireEvent.press(reactComponent);
    expect(onPressSelectReaction).toBeCalled();
  });

  it(`renders correctly with props onLongPressReaction `, () => {
    const onAddReaction = jest.fn();
    const onRemoveReaction = jest.fn();
    const onPressSelectReaction = jest.fn();
    const onLongPressReaction = jest.fn();
    const rendered = renderWithRedux(
      <ReactionView
        style={{}}
        ownReactions={ownReactions}
        reactionCounts={reactionCounts}
        reactionsOrder={reactionsOrder}
        showSelectReactionWhenEmpty
        onAddReaction={onAddReaction}
        onRemoveReaction={onRemoveReaction}
        onPressSelectReaction={onPressSelectReaction}
        onLongPressReaction={onLongPressReaction}
      />,
      store,
    );
    const reactComponent = rendered.getByTestId('reaction.button.grinning');
    fireEvent(reactComponent, 'onLongPress');
    expect(onLongPressReaction).toBeCalledWith('grinning');
  });

  it(`renders correctly with props onAddReaction `, () => {
    const reactionCounts = {
      comment: 1,
      comment_count: 6,
      rolling_on_the_floor_laughing: 1,
    };
    const reactionsOrder = ['rolling_on_the_floor_laughing'];

    const onAddReaction = jest.fn();
    const onRemoveReaction = jest.fn();
    const onPressSelectReaction = jest.fn();
    const onLongPressReaction = jest.fn();
    const rendered = renderWithRedux(
      <ReactionView
        style={{}}
        ownReactions={ownReactionsEmpty}
        reactionCounts={reactionCounts}
        reactionsOrder={reactionsOrder}
        showSelectReactionWhenEmpty
        onAddReaction={onAddReaction}
        onRemoveReaction={onRemoveReaction}
        onPressSelectReaction={onPressSelectReaction}
        onLongPressReaction={onLongPressReaction}
      />,
      store,
    );
    const reactComponent = rendered.getByTestId(
      'reaction.button.rolling_on_the_floor_laughing',
    );
    fireEvent.press(reactComponent);
    expect(onAddReaction).toBeCalledWith('rolling_on_the_floor_laughing');
  });

  it(`renders correctly with props onRemoveReaction `, () => {
    const onAddReaction = jest.fn();
    const onRemoveReaction = jest.fn();
    const onPressSelectReaction = jest.fn();
    const onLongPressReaction = jest.fn();
    const rendered = renderWithRedux(
      <ReactionView
        style={{}}
        ownReactions={ownReactions}
        reactionCounts={reactionCounts}
        reactionsOrder={reactionsOrder}
        showSelectReactionWhenEmpty
        onAddReaction={onAddReaction}
        onRemoveReaction={onRemoveReaction}
        onPressSelectReaction={onPressSelectReaction}
        onLongPressReaction={onLongPressReaction}
      />,
      store,
    );
    const reactComponent = rendered.getByTestId('reaction.button.grinning');
    fireEvent.press(reactComponent);
    expect(onRemoveReaction).toBeCalledWith('grinning');
  });
});

const ownReactionsEmpty = {comment: [], comment_count: []};

const reactionCountsEmpty = {};

const ownReactions = {
  comment: [],
  comment_count: [
    {
      activity_id: '4e419bb0-9569-11ec-8080-800055f93c41',
      children_counts: {},
      created_at: '2022-02-25T05:09:29.239287Z',
      data: {},
      id: '6af3eb0d-b40a-450b-88c7-c89f8bdfc3be',
      kind: 'comment_count',
      latest_children: {},
      parent: '',
      updated_at: '2022-02-25T05:09:29.239287Z',
      user: {
        created_at: '2022-01-10T03:45:06.563478Z',
        data: {
          avatar:
            'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
          fullname: 'Trần Nam Anh',
          username: 'trannamanh',
        },
        id: '2',
        updated_at: '2022-02-08T08:11:15.986495Z',
      },
      user_id: '2',
    },
    {
      activity_id: '4e419bb0-9569-11ec-8080-800055f93c41',
      children_counts: {},
      created_at: '2022-02-25T05:07:58.177018Z',
      data: {},
      id: '6e7ddb00-f30e-47c8-b08d-346a4c4c00da',
      kind: 'comment_count',
      latest_children: {},
      parent: '',
      updated_at: '2022-02-25T05:07:58.177018Z',
      user: {
        created_at: '2022-01-10T03:45:06.563478Z',
        data: {
          avatar:
            'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
          fullname: 'Trần Nam Anh',
          username: 'trannamanh',
        },
        id: '2',
        updated_at: '2022-02-08T08:11:15.986495Z',
      },
      user_id: '2',
    },
    {
      activity_id: '4e419bb0-9569-11ec-8080-800055f93c41',
      children_counts: {},
      created_at: '2022-02-25T05:07:54.327375Z',
      data: {},
      id: '955390d2-a884-48c3-ac65-054d1870bd51',
      kind: 'comment_count',
      latest_children: {},
      parent: '',
      updated_at: '2022-02-25T05:07:54.327375Z',
      user: {
        created_at: '2022-01-10T03:45:06.563478Z',
        data: {
          avatar:
            'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
          fullname: 'Trần Nam Anh',
          username: 'trannamanh',
        },
        id: '2',
        updated_at: '2022-02-08T08:11:15.986495Z',
      },
      user_id: '2',
    },
    {
      activity_id: '4e419bb0-9569-11ec-8080-800055f93c41',
      children_counts: {},
      created_at: '2022-02-25T05:07:23.075472Z',
      data: {},
      id: 'c6a547c6-0830-4687-b18a-11b93ab62462',
      kind: 'comment_count',
      latest_children: {},
      parent: '',
      updated_at: '2022-02-25T05:07:23.075472Z',
      user: {
        created_at: '2022-01-10T03:45:06.563478Z',
        data: {
          avatar:
            'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
          fullname: 'Trần Nam Anh',
          username: 'trannamanh',
        },
        id: '2',
        updated_at: '2022-02-08T08:11:15.986495Z',
      },
      user_id: '2',
    },
    {
      activity_id: '4e419bb0-9569-11ec-8080-800055f93c41',
      children_counts: {},
      created_at: '2022-02-25T05:07:20.908167Z',
      data: {},
      id: '5ecb227c-ad24-4a33-998c-a69006bf72ff',
      kind: 'comment_count',
      latest_children: {},
      parent: '',
      updated_at: '2022-02-25T05:07:20.908167Z',
      user: {
        created_at: '2022-01-10T03:45:06.563478Z',
        data: {
          avatar:
            'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
          fullname: 'Trần Nam Anh',
          username: 'trannamanh',
        },
        id: '2',
        updated_at: '2022-02-08T08:11:15.986495Z',
      },
      user_id: '2',
    },
  ],
  grinning: [
    {
      activity_id: '4e419bb0-9569-11ec-8080-800055f93c41',
      created_at: '2022-02-25T01:39:48.337761Z',
      id: '627b8324-3a14-402d-a8d1-565d01821901',
      kind: 'grinning',
      parent: '',
      updated_at: '2022-02-25T01:39:48.337761Z',
      user: {
        created_at: '2022-01-10T03:45:06.563478Z',
        data: {
          avatar:
            'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
          fullname: 'Trần Nam Anh',
          username: 'trannamanh',
        },
        id: '2',
        updated_at: '2022-02-08T08:11:15.986495Z',
      },
      user_id: '2',
    },
  ],
  grinning_face_with_star_eyes: [
    {
      activity_id: '4e419bb0-9569-11ec-8080-800055f93c41',
      created_at: '2022-02-25T01:39:45.772607Z',
      id: '24215cc8-bace-4e77-b464-34dccd02beed',
      kind: 'grinning_face_with_star_eyes',
      parent: '',
      updated_at: '2022-02-25T01:39:45.772607Z',
      user: {
        created_at: '2022-01-10T03:45:06.563478Z',
        data: {
          avatar:
            'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
          fullname: 'Trần Nam Anh',
          username: 'trannamanh',
        },
        id: '2',
        updated_at: '2022-02-08T08:11:15.986495Z',
      },
      user_id: '2',
    },
  ],
  kissing_smiling_eyes: [
    {
      activity_id: '4e419bb0-9569-11ec-8080-800055f93c41',
      created_at: '2022-02-25T01:39:42.838038Z',
      id: '05835947-f18a-42a2-992e-4ec03cd01cc5',
      kind: 'kissing_smiling_eyes',
      parent: '',
      updated_at: '2022-02-25T01:39:42.838038Z',
      user: {
        created_at: '2022-01-10T03:45:06.563478Z',
        data: {
          avatar:
            'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
          fullname: 'Trần Nam Anh',
          username: 'trannamanh',
        },
        id: '2',
        updated_at: '2022-02-08T08:11:15.986495Z',
      },
      user_id: '2',
    },
  ],
  wink: [
    {
      activity_id: '4e419bb0-9569-11ec-8080-800055f93c41',
      created_at: '2022-02-25T01:39:44.505716Z',
      id: 'b99cbc45-1e9d-4ee2-a3ea-8f556cc6f981',
      kind: 'wink',
      parent: '',
      updated_at: '2022-02-25T01:39:44.505716Z',
      user: {
        created_at: '2022-01-10T03:45:06.563478Z',
        data: {
          avatar:
            'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
          fullname: 'Trần Nam Anh',
          username: 'trannamanh',
        },
        id: '2',
        updated_at: '2022-02-08T08:11:15.986495Z',
      },
      user_id: '2',
    },
  ],
};

const reactionCounts = {
  comment: 0,
  comment_count: 0,
  grinning: 1,
  grinning_face_with_star_eyes: 1,
  kissing_smiling_eyes: 1,
  wink: 1,
};

const reactionsOrder = [
  'kissing_smiling_eyes',
  'wink',
  'grinning_face_with_star_eyes',
  'grinning',
];
