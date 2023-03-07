import * as React from 'react';
import { cleanup } from '@testing-library/react-native';
import ReactionView from '~/beinComponents/ReactionView';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import { IOwnReaction } from '~/interfaces/IPost';

afterEach(cleanup);

describe('ReactionView component', () => {
  it('renders correctly', () => {
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
    );
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('renders correctly with props Reactions Order ', () => {
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
    );
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('renders correctly with props Reactions Order empty ', () => {
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
    );
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('renders correctly with props showSelectReactionWhenEmpty', () => {
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
    );
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('renders correctly with props showSelectReactionWhenEmpty = false ', () => {
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
    );
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('renders correctly with props onPressSelectReaction ', () => {
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
    );
    const reactComponent = rendered.getByTestId('reaction_view.react');
    fireEvent.press(reactComponent);
    expect(onPressSelectReaction).toBeCalled();
  });

  it('renders correctly with props onLongPressReaction ', () => {
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
    );
    const reactComponent = rendered.getByTestId('reaction.button.grinning');
    fireEvent(reactComponent, 'onLongPress');
    expect(onLongPressReaction).toBeCalledWith('grinning');
  });

  it('renders correctly with props onAddReaction ', () => {
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
    );
    const reactComponent = rendered.getByTestId(
      'reaction.button.grinning_face_with_star_eyes',
    );
    fireEvent.press(reactComponent);
    expect(onAddReaction).toBeCalledWith('grinning_face_with_star_eyes');
  });

  it('renders correctly with props onRemoveReaction ', () => {
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
    );
    const reactComponent = rendered.getByTestId('reaction.button.sweat_smile');
    expect(reactComponent).toBeDefined();
    fireEvent.press(reactComponent);
    expect(onRemoveReaction).toBeCalledWith('sweat_smile');
  });
});

const ownReactionsEmpty: any = [];

const reactionCountsEmpty = {};

const ownReactions = [
  {
    id: '165',
    postId: '46',
    reactionName: 'sweat_smile',
    createdBy: 58,
    createdAt: '2022-04-21T03:05:36.908Z',
  },
] as IOwnReaction;

const reactionCounts = {
  0: {
    grinning: 1,
  },
  1: {
    grinning_face_with_star_eyes: 1,
  },
  2: {
    kissing_smiling_eyes: 1,
  },
  3: {
    sweat_smile: 2,
  },
};
