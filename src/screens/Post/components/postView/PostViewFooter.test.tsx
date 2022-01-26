import React from 'react';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import {render, cleanup, fireEvent} from '@testing-library/react-native';
import PostViewFooter from '~/screens/Post/components/postView/PostViewFooter';

afterEach(cleanup);

describe('PostViewFooter component', () => {
  const mockStore = configureStore([]);

  it('should render correctly', () => {
    const store = mockStore({count: 5});
    const rendered = render(
      <Provider store={store}>
        <PostViewFooter labelButtonComment={'Comment'} reactionCounts={{}} />
      </Provider>,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  // it('should fire onAddReaction event', () => {
  //   const store = mockStore({count: 5});
  //   const onAddReaction = jest.fn();
  //   const rendered = render(
  //     <Provider store={store}>
  //       <PostViewFooter
  //         labelButtonComment={'Comment'}
  //         reactionCounts={{}}
  //         onAddReaction={onAddReaction}
  //         btnReactTestID={'btnReactTestID'}
  //       />
  //     </Provider>,
  //   );
  //   const btnReact = rendered.getByTestId('btnReactTestID');
  //   fireEvent(btnReact, 'onPress');
  //   expect(onAddReaction).toHaveBeenCalled();
  // });
  //
  // it('should fire onPressComment event', () => {
  //   const store = mockStore({count: 5});
  //   const onPressComment = jest.fn();
  //   const rendered = render(
  //     <Provider store={store}>
  //       <PostViewFooter
  //         labelButtonComment={'Comment'}
  //         onPressComment={onPressComment}
  //         btnCommentTestID={'btnCommentTestID'}
  //         reactionCounts={{}}
  //       />
  //     </Provider>,
  //   );
  //   const btnReact = rendered.getByTestId('btnCommentTestID');
  //   fireEvent(btnReact, 'onClick');
  //   expect(onPressComment).toHaveBeenCalled();
  // });
  //
});
