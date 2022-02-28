import * as React from 'react';
import {cleanup} from '@testing-library/react-native';

import {fireEvent, renderWithRedux, configureStore} from '~/test/testUtils';
import ReactionDetailBottomSheet from './index';
import initialState from '~/store/initialState';

afterEach(cleanup);

describe('ReactionDetailBottomSheet component', () => {
  const mockStore = configureStore([]);

  const getDataPromise = jest.fn();
  const fake_data = {
    getDataParam: {
      commentId: undefined,
      postId: 'efe9c800-92be-11ec-8080-800124087730',
    },
    getDataPromise: getDataPromise,
    initReaction: 'sweat_smile',
    isOpen: true,
    reactionCounts: {
      comment: 9,
      comment_count: 11,
      grinning_face_with_star_eyes: 2,
      kissing_closed_eyes: 2,
      kissing_smiling_eyes: 2,
      sweat_smile: 3,
    },
  };
  it('renders correctly', () => {
    const storeData = {...initialState};

    // @ts-ignore
    storeData.modal.reactionDetailBottomSheet = fake_data;
    const store = mockStore(storeData);

    const rendered = renderWithRedux(
      <ReactionDetailBottomSheet />,
      store,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it(`should call navigate to user profile when click item`, () => {
    const storeData = {...initialState};

    // @ts-ignore
    storeData.modal.reactionDetailBottomSheet = fake_data;
    const store = mockStore(storeData);

    const rendered = renderWithRedux(<ReactionDetailBottomSheet />, store);
    expect(rendered).toMatchSnapshot();

    const btnComponent = rendered.getByTestId(
      'reaction_detail_bottomSheet.user_item',
    );
    expect(btnComponent).toBeDefined();
    fireEvent.press(btnComponent);
  });
});
