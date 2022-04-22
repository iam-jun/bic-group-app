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
        ownerReactions={ownReactions}
        reactionsCount={reactionCounts}
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
        ownerReactions={ownReactions}
        reactionsCount={reactionCounts}
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
        ownerReactions={ownReactionsEmpty}
        reactionsCount={reactionCountsEmpty}
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
        ownerReactions={ownReactionsEmpty}
        reactionsCount={reactionCountsEmpty}
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
        ownerReactions={ownReactionsEmpty}
        reactionsCount={reactionCountsEmpty}
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
        ownerReactions={ownReactions}
        reactionsCount={reactionCounts}
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
        ownerReactions={ownReactionsEmpty}
        reactionsCount={reactionCountsEmpty}
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
        ownerReactions={ownReactions}
        reactionsCount={reactionCounts}
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
    const onAddReaction = jest.fn();
    const onRemoveReaction = jest.fn();
    const onPressSelectReaction = jest.fn();
    const onLongPressReaction = jest.fn();
    const rendered = renderWithRedux(
      <ReactionView
        style={{}}
        ownerReactions={ownReactionsEmpty}
        reactionsCount={reactionCounts}
        showSelectReactionWhenEmpty
        onAddReaction={onAddReaction}
        onRemoveReaction={onRemoveReaction}
        onPressSelectReaction={onPressSelectReaction}
        onLongPressReaction={onLongPressReaction}
      />,
      store,
    );
    const reactComponent = rendered.getByTestId(
      'reaction.button.grinning_face_with_star_eyes',
    );
    fireEvent.press(reactComponent);
    expect(onAddReaction).toBeCalledWith('grinning_face_with_star_eyes');
  });

  it(`renders correctly with props onRemoveReaction `, () => {
    const onAddReaction = jest.fn();
    const onRemoveReaction = jest.fn();
    const onPressSelectReaction = jest.fn();
    const onLongPressReaction = jest.fn();
    const rendered = renderWithRedux(
      <ReactionView
        style={{}}
        ownerReactions={ownReactions}
        reactionsCount={reactionCounts}
        showSelectReactionWhenEmpty
        onAddReaction={onAddReaction}
        onRemoveReaction={onRemoveReaction}
        onPressSelectReaction={onPressSelectReaction}
        onLongPressReaction={onLongPressReaction}
      />,
      store,
    );
    const reactComponent = rendered.getByTestId('reaction.button.sweat_smile');
    fireEvent.press(reactComponent);
    expect(onRemoveReaction).toBeCalledWith('sweat_smile');
  });
});

const ownReactionsEmpty: any = [];

const reactionCountsEmpty = {};

const ownReactions = [
  {
    id: 165,
    postId: 46,
    reactionName: 'sweat_smile',
    createdBy: 58,
    createdAt: '2022-04-21T03:05:36.908Z',
  },
];

const reactionCounts = {
  '0': {
    grinning: 1,
  },
  '1': {
    grinning_face_with_star_eyes: 1,
  },
  '2': {
    kissing_smiling_eyes: 1,
  },
  '3': {
    sweat_smile: 2,
  },
};
